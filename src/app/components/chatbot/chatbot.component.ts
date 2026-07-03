import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  type: 'bot' | 'user';
  time: string;
}

interface QuickReply {
  text: string;
  label: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  isTyping = false;

  quickReplies: QuickReply[] = [
    { text: 'Información del curso', label: '📋 Info del curso' },
    { text: 'Certificaciones Azure', label: '🏆 Certificaciones' },
    { text: 'Precios y planes', label: '💰 Precios' },
    { text: 'Recursos de estudio', label: '📚 Recursos' }
  ];

  private azureKnowledge: Record<string, { patterns: string[]; response: string }> = {
    informacion_curso: {
      patterns: ['información del curso', 'informacion del curso', 'sobre el curso', 'del curso', 'curso', 'programa'],
      response: `📚 <strong>Curso de Microsoft Azure - MIT Sloan</strong><br><br>
      <strong>Duración:</strong> 12 semanas<br>
      <strong>Modalidad:</strong> Online / Presencial<br>
      <strong>Nivel:</strong> Principiante a Avanzado<br><br>
      <strong>Temario:</strong><br>
      • Fundamentos de Cloud Computing<br>
      • Servicios de computación (VMs, App Services)<br>
      • Almacenamiento y bases de datos<br>
      • Redes virtuales y seguridad<br>
      • Identity & Access Management<br>
      • Monitorización y optimización<br><br>
      ¿Te gustaría saber más sobre algún tema específico?`
    },
    certificaciones: {
      patterns: ['certificaciones', 'certificaciones azure', 'exámenes', 'az-900', 'az-104', 'az-204', 'certificación'],
      response: `🏆 <strong>Certificaciones Microsoft Azure:</strong><br><br>
      <strong>Fundamentals:</strong><br>
      • AZ-900: Azure Fundamentals<br><br>
      <strong>Associate:</strong><br>
      • AZ-104: Azure Administrator<br>
      • AZ-204: Azure Developer<br>
      • AZ-305: Azure Solutions Architect<br><br>
      <em>Recomendamos comenzar con AZ-900 si eres nuevo en Azure.</em><br><br>
      ¿Cuál te interesa más?`
    },
    recursos: {
      patterns: ['recursos', 'recursos de estudio', 'material', 'bibliografía', 'estudio', 'documentación'],
      response: `📚 <strong>Recursos de Estudio:</strong><br><br>
      <strong>Plataforma MIT Sloan:</strong><br>
      • Videos interactivos<br>
      • Laboratorios prácticos en Azure<br>
      • Quizzes y exámenes de práctica<br><br>
      <strong>Microsoft Learn:</strong><br>
      • Rutas de aprendizaje gratuitas<br>
      • Sandbox gratuito<br><br>
      <strong>Documentación oficial:</strong><br>
      • Microsoft Docs<br>
      • Azure Architecture Center<br><br>
      ¿Necesitas ayuda con algún recurso específico?`
    },
    precios: {
      patterns: ['precios', 'precio', 'costo', 'inversión', 'pago', 'plan', 'planes'],
      response: `💰 <strong>Inversión del Programa:</strong><br><br>
      <strong>Curso Completo (12 semanas):</strong><br>
      • $2,500 USD - Estudiantes<br>
      • $3,200 USD - Profesionales<br><br>
      <strong>Incluye:</strong><br>
      ✓ Acceso a plataforma MIT Sloan<br>
      ✓ 40+ horas de contenido<br>
      ✓ Laboratorios prácticos<br>
      ✓ Certificado de completion<br>
      ✓ Mentoría 1:1<br>
      ✓ Voucher examen AZ-900<br><br>
      <strong>Opciones de pago:</strong><br>
      • Pago único (5% descuento)<br>
      • 3 cuotas sin interés<br><br>
      ¿Te gustaría agendar una sesión informativa?`
    },
    azure_basico: {
      patterns: ['qué es azure', 'que es azure', 'definición azure', 'azure', 'cloud computing'],
      response: `☁️ <strong>Microsoft Azure</strong> es la plataforma de cloud computing de Microsoft.<br><br>
      <strong>Servicios principales:</strong><br>
      • <strong>Compute:</strong> Máquinas virtuales, App Services<br>
      • <strong>Storage:</strong> Blob, Files, Disks<br>
      • <strong>Database:</strong> SQL, Cosmos DB, MySQL<br>
      • <strong>Networking:</strong> Virtual Networks, Load Balancers<br>
      • <strong>AI/ML:</strong> Cognitive Services, Machine Learning<br><br>
      <strong>Ventajas:</strong><br>
      ✓ Escalabilidad automática<br>
      ✓ Pago por uso<br>
      ✓ Seguridad empresarial<br>
      ✓ Integración con Microsoft 365<br><br>
      ¿Quieres profundizar en algún servicio?`
    },
    saludo: {
      patterns: ['hola', 'buenos días', 'buenas tardes', 'hey', 'hi', 'saludos'],
      response: `¡Hola! 👋 Bienvenido al Azure Course Assistant.<br><br>
      Estoy aquí para resolver todas tus dudas sobre el programa de Azure de MIT Sloan.<br><br>
      ¿Qué te gustaría saber?`
    },
    gracias: {
      patterns: ['gracias', 'thank you', 'agradezco', 'thanks'],
      response: `¡De nada! 😊<br><br>
      Estoy aquí para ayudarte cuando lo necesites.<br><br>
      ¿Hay algo más en lo que pueda asistirte?`
    },
    adios: {
      patterns: ['adiós', 'adios', 'chao', 'hasta luego', 'bye', 'nos vemos'],
      response: `¡Hasta pronto! 👋<br><br>
      Gracias por tu interés en el Azure Course de MIT Sloan.<br><br>
      <strong>Contacto:</strong><br>
      📧 azure@mitsloan.edu<br>
      📞 +1 (617) 253-7100<br><br>
      ¡Esperamos verte en clase! 🎓`
    }
  };

  ngOnInit(): void {
    this.messages.push({
      text: `<strong>¡Bienvenido!</strong> 👋<br><br>
        Soy tu asistente del curso de Azure en MIT Sloan. Puedo ayudarte con:<br><br>
        • Información del programa<br>
        • Certificaciones disponibles<br>
        • Recursos de estudio<br>
        • Precios y admisión<br><br>
        ¿En qué puedo ayudarte?`,
      type: 'bot',
      time: this.getCurrentTime()
    });
  }

  toggleChatbot(): void {
    this.isOpen = !this.isOpen;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({
      text,
      type: 'user',
      time: this.getCurrentTime()
    });

    this.userInput = '';
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const response = this.getAzureResponse(text);
      this.messages.push({
        text: response,
        type: 'bot',
        time: this.getCurrentTime()
      });
    }, 1000 + Math.random() * 1000);
  }

  quickReply(text: string): void {
    this.userInput = text;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  private getAzureResponse(userText: string): string {
    const text = userText.toLowerCase().trim();

    for (const key in this.azureKnowledge) {
      if (this.azureKnowledge[key].patterns.some(pattern => text.includes(pattern))) {
        return this.azureKnowledge[key].response;
      }
    }

    const fallbackResponses = [
      `Interesante pregunta 🤔<br><br>
      Para darte una respuesta más precisa, te sugiero:<br>
      • Consultar la documentación oficial<br>
      • Preguntar en los foros del curso<br>
      • Agendar una sesión con el instructor<br><br>
      ¿Hay algo más específico sobre el curso que quieras saber?`,

      `No estoy seguro de entender completamente tu pregunta.<br><br>
      ¿Podrías reformularla? También puedo ayudarte con:<br>
      • Información del curso<br>
      • Certificaciones Azure<br>
      • Recursos de estudio<br>
      • Precios y planes<br><br>
      ¿Qué te gustaría conocer?`,

      `Ese es un buen punto 💡<br><br>
      Te recomiendo escribir "ayuda" o "información del curso" para ver todo lo que puedo ayudarte.<br><br>
      También puedes contactarnos directamente:<br>
      📧 azure@mitsloan.edu<br>
      📞 +1 (617) 253-7100`
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}