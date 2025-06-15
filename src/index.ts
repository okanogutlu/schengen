import express, { Request, Response } from 'express';
import cron from 'node-cron';
import { config } from './config/environment';
import { cacheService } from './services/cache';
import { checkAppointments } from './utils/appointmentChecker';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (_req: Request, res: Response) => {
  res.send('Visa checker bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Cloud Run HTTP sunucusu ${PORT} portunda başlatıldı.`);
});

cacheService.startCleanupInterval();

cron.schedule(config.app.checkInterval, checkAppointments);
console.log(`Vize randevu kontrolü başlatıldı. Kontrol sıklığı: ${config.app.checkInterval}`);
console.log(`Hedef ülke: ${config.app.targetCountry}`);
console.log(`Hedef ülkeler: ${config.app.missionCountries.join(', ')}`);
if (config.app.targetCities.length > 0) {
  console.log(`Hedef şehirler: ${config.app.targetCities.join(', ')}`);
}

void checkAppointments();
