import logging

logger = logging.getLogger(__name__)


class ValidationError(Exception):
    """Excepción personalizada para errores de validación"""
    pass


class DollValidator:
    """Validador para muñecas"""
    
    @staticmethod
    def validate(data):
        """
        Valida los datos de una muñeca
        
        Args:
            data: Dict con datos de la muñeca
        
        Returns:
            Dict validado o lanza ValidationError
        """
        errors = []
        
        # Validar nombre
        if 'nombre' not in data or not data['nombre'].strip():
            errors.append("El nombre es requerido")
        elif len(data['nombre']) > 255:
            errors.append("El nombre no puede exceder 255 caracteres")
        
        # Validar marca
        if 'marca_id' not in data or not data['marca_id']:
            errors.append("La marca es requerida")
        elif not isinstance(data['marca_id'], int) or data['marca_id'] <= 0:
            errors.append("ID de marca inválido")
        
        # Validar fabricante
        if 'fabricante_id' not in data or not data['fabricante_id']:
            errors.append("El fabricante es requerido")
        elif not isinstance(data['fabricante_id'], int) or data['fabricante_id'] <= 0:
            errors.append("ID de fabricante inválido")
        
        # Validar precio
        if 'precio' in data and data['precio']:
            try:
                price = float(data['precio'])
                if price < 0:
                    errors.append("El precio no puede ser negativo")
            except (ValueError, TypeError):
                errors.append("Precio inválido")
        
        # Validar imagen
        if 'imagen' in data and data['imagen']:
            if len(data['imagen']) > 2000:
                errors.append("Path de imagen muy largo")
        
        if errors:
            raise ValidationError("; ".join(errors))
        
        return data


class LoteValidator:
    """Validador para lotes"""
    
    @staticmethod
    def validate(data):
        """
        Valida los datos de un lote
        
        Args:
            data: Dict con datos del lote
        
        Returns:
            Dict validado o lanza ValidationError
        """
        errors = []
        
        # Validar nombre
        if 'nombre' not in data or not data['nombre'].strip():
            errors.append("El nombre del lote es requerido")
        elif len(data['nombre']) > 255:
            errors.append("El nombre no puede exceder 255 caracteres")
        
        # Validar número de referencia
        if 'numero_referencia' not in data or not data['numero_referencia'].strip():
            errors.append("El número de referencia es requerido")
        elif len(data['numero_referencia']) > 50:
            errors.append("El número de referencia no puede exceder 50 caracteres")
        
        # Validar cantidad
        if 'cantidad' not in data or data['cantidad'] is None:
            errors.append("La cantidad es requerida")
        else:
            try:
                qty = int(data['cantidad'])
                if qty <= 0:
                    errors.append("La cantidad debe ser mayor a 0")
            except (ValueError, TypeError):
                errors.append("Cantidad inválida")
        
        # Validar precio base
        if 'precio_base' not in data or data['precio_base'] is None:
            errors.append("El precio base es requerido")
        else:
            try:
                price = float(data['precio_base'])
                if price < 0:
                    errors.append("El precio base no puede ser negativo")
            except (ValueError, TypeError):
                errors.append("Precio base inválido")
        
        # Validar precio venta
        if 'precio_venta' not in data or data['precio_venta'] is None:
            errors.append("El precio de venta es requerido")
        else:
            try:
                price = float(data['precio_venta'])
                if price < 0:
                    errors.append("El precio de venta no puede ser negativo")
            except (ValueError, TypeError):
                errors.append("Precio de venta inválido")
        
        if errors:
            raise ValidationError("; ".join(errors))
        
        return data


class MarcaValidator:
    """Validador para marcas"""
    
    @staticmethod
    def validate(data):
        """
        Valida los datos de una marca
        
        Args:
            data: Dict con datos de la marca
        
        Returns:
            Dict validado o lanza ValidationError
        """
        errors = []
        
        # Validar nombre
        if 'nombre' not in data or not data['nombre'].strip():
            errors.append("El nombre de la marca es requerido")
        elif len(data['nombre']) > 100:
            errors.append("El nombre no puede exceder 100 caracteres")
        
        # Validar que no sea duplicado (se valida en la ruta si es necesario)
        
        if errors:
            raise ValidationError("; ".join(errors))
        
        return data


class FabricanteValidator:
    """Validador para fabricantes"""
    
    @staticmethod
    def validate(data):
        """
        Valida los datos de un fabricante
        
        Args:
            data: Dict con datos del fabricante
        
        Returns:
            Dict validado o lanza ValidationError
        """
        errors = []
        
        # Validar nombre
        if 'nombre' not in data or not data['nombre'].strip():
            errors.append("El nombre del fabricante es requerido")
        elif len(data['nombre']) > 100:
            errors.append("El nombre no puede exceder 100 caracteres")
        
        # Validar país
        if 'pais' in data and data['pais']:
            if len(data['pais']) > 50:
                errors.append("El país no puede exceder 50 caracteres")
        
        if errors:
            raise ValidationError("; ".join(errors))
        
        return data
