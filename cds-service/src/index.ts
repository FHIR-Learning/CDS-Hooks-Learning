import express, { Request, Response } from "express";
import morgan from "morgan";
import logger from "./logger";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Log middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Endpoint de discovery
app.get("/cds-services", (req: Request, res: Response) => {
  res.json({
    services: [
      {
        hook: "patient-view",
        id: "patient-view-service",
        title: "Patient View Service",
        description:
          "Provides clinical recommendations when viewing a patient record.",
        prefetch: {
          patient: "Patient/{{context.patientId}}",
        },
      },
      {
        hook: "patient-view",
        id: "patient-view-reminder",
        title: "Patient View Reminder Service",
        description: "Reminds clinicians of routine check-ups and assessments.",
        prefetch: {
          patient: "Patient/{{context.patientId}}",
        },
      },
    ],
  });
});

// Endpoint para el primer patient-view hook
app.post(
  "/cds-services/patient-view-service",
  (req: Request, res: Response) => {
    const { context, prefetch } = req.body;
    logger.info(
      `Solicitud de patient-view recibida para el paciente: ${context.patientId}`
    );

    const patient = prefetch?.patient;

    if (patient) {
      logger.info(`Procesando datos del paciente: ${patient.id}`);
      res.json({
        cards: [
          {
            summary: `Recordatorio: Revisión de paciente ${patient.id}`,
            indicator: "info",
            detail: `Este paciente necesita revisiones adicionales. Verifique los antecedentes clínicos para obtener más información.`,
            source: {
              label: "Patient View Service",
              url: "http://example.com",
            },
          },
        ],
      });
      logger.info("Respuesta de CDS Hook enviada correctamente");
    } else {
      logger.error("El prefetch de paciente no está disponible");
      res
        .status(400)
        .json({ error: "El prefetch de paciente no está disponible." });
    }
  }
);

// Endpoint para el nuevo patient-view hook
app.post(
  "/cds-services/patient-view-reminder",
  (req: Request, res: Response) => {
    const { context, prefetch } = req.body;
    logger.info(
      `Solicitud de patient-view-reminder recibida para el paciente: ${context.patientId}`
    );

    const patient = prefetch?.patient;

    if (patient) {
      logger.info(
        `Procesando recordatorio de revisión para el paciente: ${patient.id}`
      );
      res.json({
        cards: [
          {
            summary: `Revisión de rutina pendiente para el paciente ${patient.id}`,
            indicator: "warning",
            detail: `Este paciente está programado para una revisión de rutina en los próximos días.`,
            source: {
              label: "Patient View Reminder Service",
              url: "http://example-reminder.com",
            },
          },
        ],
      });
      logger.info("Respuesta de patient-view-reminder enviada correctamente");
    } else {
      logger.error(
        "El prefetch de paciente no está disponible en el recordatorio"
      );
      res
        .status(400)
        .json({ error: "El prefetch de paciente no está disponible." });
    }
  }
);

app.listen(PORT, () => {
  console.log(`CDS Service running on http://localhost:${PORT}`);
});
