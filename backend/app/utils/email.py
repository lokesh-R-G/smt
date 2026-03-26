import asyncio
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings


async def send_text_email(to_email: str, subject: str, body: str) -> None:
    settings = get_settings()

    def _send() -> None:
        message = EmailMessage()
        message["From"] = settings.smtp_from_email
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)

    await asyncio.to_thread(_send)
