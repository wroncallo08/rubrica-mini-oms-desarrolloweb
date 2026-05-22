class User:
    def __init__(self, id=None, name="", email="", password="", role="user"):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }

    @staticmethod
    def from_dict(data):
        return User(
            id=data.get("id"),
            name=data.get("name", ""),
            email=data.get("email", ""),
            password=data.get("password", ""),
            role=data.get("role", "user")
        )

class Order:
    def __init__(self, id=None, user_id=None, client_name="", product="", quantity=1, unit_price=0.0, total_price=None, status="Pendiente", created_at=None):
        self.id = id
        self.user_id = user_id
        self.client_name = client_name
        self.product = product
        self.quantity = quantity
        self.unit_price = unit_price
        self.total_price = total_price if total_price is not None else (quantity * unit_price)
        self.status = status
        self.created_at = created_at

    def calculate_total(self):
        self.total_price = self.quantity * self.unit_price

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "clientName": self.client_name,
            "product": self.product,
            "quantity": self.quantity,
            "unitPrice": self.unit_price,
            "totalPrice": self.total_price,
            "status": self.status,
            "createdAt": self.created_at
        }

    @staticmethod
    def from_dict(data):
        client_name = data.get("clientName") or data.get("client_name", "")
        product = data.get("product", "")
        quantity = int(data.get("quantity", 1))
        unit_price = float(data.get("unitPrice") or data.get("unit_price", 0.0))
        total_price = data.get("totalPrice") or data.get("total_price")
        if total_price is not None:
            total_price = float(total_price)
        status = data.get("status", "Pendiente")
        created_at = data.get("createdAt") or data.get("created_at")

        return Order(
            id=data.get("id"),
            user_id=data.get("userId") or data.get("user_id"),
            client_name=client_name,
            product=product,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            status=status,
            created_at=created_at
        )
