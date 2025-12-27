// Package utils provides utility functions
package utils

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/mcmarin9/dolls/config"
	"github.com/nfnt/resize"
)

var logger = NewLogger("image_handler")

// AllowedFile checks if the file extension is allowed
func AllowedFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	if ext != "" {
		ext = ext[1:] // Remove the dot
	}

	for _, allowed := range config.AppConfig.AllowedExtensions {
		if ext == allowed {
			return true
		}
	}
	return false
}

// OptimizeImage optimizes an image by resizing and compressing it
func OptimizeImage(file multipart.File, maxWidth, maxHeight uint) (*bytes.Buffer, error) {
	// Decode the image
	img, format, err := image.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("error decoding image: %w", err)
	}

	logger.Debug(fmt.Sprintf("Original image format: %s, size: %dx%d", format, img.Bounds().Dx(), img.Bounds().Dy()))

	// Resize the image maintaining aspect ratio
	resized := resize.Thumbnail(maxWidth, maxHeight, img, resize.Lanczos3)

	// Encode to JPEG
	var buf bytes.Buffer
	opts := &jpeg.Options{Quality: config.AppConfig.ImageQuality}
	if err := jpeg.Encode(&buf, resized, opts); err != nil {
		return nil, fmt.Errorf("error encoding image: %w", err)
	}

	logger.Info(fmt.Sprintf("Image optimized: %dx%d -> %dx%d",
		img.Bounds().Dx(), img.Bounds().Dy(),
		resized.Bounds().Dx(), resized.Bounds().Dy()))

	return &buf, nil
}

// SaveImage saves an uploaded image to disk
func SaveImage(fileHeader *multipart.FileHeader) (string, error) {
	if fileHeader == nil {
		return "", fmt.Errorf("no file provided")
	}

	if !AllowedFile(fileHeader.Filename) {
		return "", fmt.Errorf("file extension not allowed: %s", fileHeader.Filename)
	}

	// Validate file size (MaxFileSize from config, default 5MB)
	if fileHeader.Size > config.AppConfig.MaxFileSize {
		return "", fmt.Errorf("file size exceeds maximum allowed (%d bytes)", config.AppConfig.MaxFileSize)
	}

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(config.AppConfig.UploadFolder, 0755); err != nil {
		return "", fmt.Errorf("error creating upload directory: %w", err)
	}

	// Open the file
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	// Generate unique filename
	uniqueFilename := fmt.Sprintf("%s.jpg", uuid.New().String())

	// Optimize the image
	optimized, err := OptimizeImage(file,
		uint(config.AppConfig.ImageMaxWidth),
		uint(config.AppConfig.ImageMaxHeight))
	if err != nil {
		return "", fmt.Errorf("error optimizing image: %w", err)
	}

	// Save to disk
	filepath := filepath.Join(config.AppConfig.UploadFolder, uniqueFilename)
	outFile, err := os.Create(filepath)
	if err != nil {
		return "", fmt.Errorf("error creating file: %w", err)
	}
	defer outFile.Close()

	if _, err := io.Copy(outFile, optimized); err != nil {
		return "", fmt.Errorf("error writing file: %w", err)
	}

	logger.Info(fmt.Sprintf("Image saved: %s", uniqueFilename))
	return fmt.Sprintf("/uploads/%s", uniqueFilename), nil
}

// DeleteImage deletes an image from disk
func DeleteImage(imagePath string) error {
	if imagePath == "" {
		return nil
	}

	// Extract filename from path (e.g., "/uploads/filename.jpg" -> "filename.jpg")
	filename := filepath.Base(imagePath)
	fullPath := filepath.Join(config.AppConfig.UploadFolder, filename)

	// Check if file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		logger.Warning(fmt.Sprintf("Image not found for deletion: %s", fullPath))
		return nil
	}

	// Delete the file
	if err := os.Remove(fullPath); err != nil {
		return fmt.Errorf("error deleting image: %w", err)
	}

	logger.Info(fmt.Sprintf("Image deleted: %s", filename))
	return nil
}
