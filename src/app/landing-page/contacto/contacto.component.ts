import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../app-web/services/email/email.service';
import { NotificationService } from '../../app-web/services/notification/sweetalert2/notification.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false; // Variable para controlar la visibilidad del spinner


  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true; // Mostrar el spinner
      const emailData = this.contactForm.value;

      this.emailService.sendEmail(emailData).subscribe(
        (response) => {
          console.log('Correo enviado', response);
          this.notificationService.showSuccess(
            'Correo enviado',
            'Hemos recibido tu correo y nos pondremos en contacto contigo lo antes posible.'
          );
          this.contactForm.reset();
          this.isSubmitting = false; // Ocultar el spinner
        },
        (error) => {
          console.error('Error al enviar el correo', error);
          this.notificationService.showError(
            'ERROR al enviar correo',
            'Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo más tarde.'
          );
          this.isSubmitting = false; // Ocultar el spinner
        }
      );
    }
  }

  inTelefonoInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, '');

    // Limitar a 10 caracteres
    const limitedValue = newValue.slice(0, 10);

    // Aplicar formato de número de teléfono (000-000-0000)
    let formattedValue = '';
    for (let i = 0; i < limitedValue.length; i++) {
      if (i === 3 || i === 6) {
        formattedValue += '-';
      }
      formattedValue += limitedValue.charAt(i);
    }

    this.contactForm
      .get('phone')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.contactForm.get('name')?.setValue(newValue, { emitEvent: false });
  }
}
