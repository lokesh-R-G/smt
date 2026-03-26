import logging

from app.core.config import get_settings
from app.schemas.order_schema import OrderResponse
from app.utils.email import send_text_email


logger = logging.getLogger("smt.backend.notification")


async def send_order_created_notifications(order: OrderResponse) -> None:
    settings = get_settings()

    product_lines = "\n".join(
        [f"- {item.name} (x{item.quantity}) @ ₹{item.price:.2f}" for item in order.products]
    )

    customer_subject = f"Order Confirmation - {order.order_id}"
    customer_body = (
        f"Hello {order.customer_name},\n\n"
        f"Your order has been created successfully.\n"
        f"Order ID: {order.order_id}\n"
        f"Company: {order.company_name}\n"
        f"Total: ₹{order.total:.2f}\n"
        f"Status: {order.status}\n\n"
        f"Items:\n{product_lines}\n\n"
        "Thank you for choosing SRI MARUTHI TRADERS."
    )

    admin_subject = f"New Order Received - {order.order_id}"
    admin_body = (
        f"A new order has been placed.\n\n"
        f"Order ID: {order.order_id}\n"
        f"Customer: {order.customer_name} ({order.customer_email})\n"
        f"Company: {order.company_name}\n"
        f"Total: ₹{order.total:.2f}\n"
        f"Shipping Address: {order.shipping_address}\n\n"
        f"Items:\n{product_lines}\n"
    )

    try:
        await send_text_email(order.customer_email, customer_subject, customer_body)
    except Exception:
        logger.exception("email_send_failed type=order_customer order_id=%s to=%s", order.order_id, order.customer_email)

    try:
        await send_text_email(settings.admin_notification_email, admin_subject, admin_body)
    except Exception:
        logger.exception(
            "email_send_failed type=order_admin order_id=%s to=%s",
            order.order_id,
            settings.admin_notification_email,
        )


async def send_enquiry_notifications(
    name: str,
    email: str,
    company: str,
    subject: str,
    message: str,
) -> None:
    settings = get_settings()

    customer_subject = "Enquiry Received - SRI MARUTHI TRADERS"
    customer_body = (
        f"Hello {name},\n\n"
        "We have received your enquiry and our team will contact you shortly.\n\n"
        f"Subject: {subject}\n"
        f"Company: {company}\n"
        f"Message: {message}\n\n"
        "Regards,\nSRI MARUTHI TRADERS"
    )

    admin_subject = f"New Enquiry - {subject}"
    admin_body = (
        "A new enquiry has been submitted.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Company: {company}\n"
        f"Subject: {subject}\n"
        f"Message: {message}\n"
    )

    try:
        await send_text_email(email, customer_subject, customer_body)
    except Exception:
        logger.exception("email_send_failed type=enquiry_customer to=%s subject=%s", email, subject)

    try:
        await send_text_email(settings.admin_notification_email, admin_subject, admin_body)
    except Exception:
        logger.exception(
            "email_send_failed type=enquiry_admin to=%s subject=%s",
            settings.admin_notification_email,
            subject,
        )
