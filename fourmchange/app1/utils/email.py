from django.core.mail import send_mail
from django.conf import settings

def send_customer_approval_email(recipient_email, change_record_id):
    subject = f"Customer Approval Required - Change Record {change_record_id}"
    message = f"""
Dear Customer,

A new 4M Change Record (ID: {change_record_id}) requires your approval.

Please log in to the system and review the change under the Customer Approval section.

Thank you.
"""
    from_email = settings.DEFAULT_FROM_EMAIL

    try:
        send_mail(subject, message, from_email, [recipient_email], fail_silently=False)
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Error sending email to {recipient_email}: {e}")
