import { createBaby } from '../services/baby.service';
import { createConsultation } from '../services/consultation.service';
import { createCost } from '../services/cost.service';
import { registerUser } from '../services/user.service';
import { createVaccine } from '../services/vaccine.service';

function seed() {
  const user = registerUser({ email: 'parent@test.com', password: 'password123' });

  const baby = createBaby({
    userId: user.id,
    name: 'Emma',
    birthDate: '2026-01-15',
    gender: 'Female',
    bloodType: 'Unknown',
    allergies: 'None',
    pediatricianName: 'Dr. Smith',
    notes: 'Healthy baby',
  });

  if (!baby) {
    throw new Error('Unable to create baby');
  }

  createConsultation({
    babyId: baby.id,
    consultationDate: '2026-06-20',
    doctorName: 'Dr. Smith',
    specialistType: 'Pediatrician',
    weight: 7.2,
    height: 64,
    diagnosis: 'Normal development',
    notes: 'Routine check-up',
  });

  createVaccine({
    babyId: baby.id,
    name: 'Hexavalent',
    recommendedAge: '6 months',
    nextDoseDate: '2026-07-15',
    status: 'Pending',
  });

  createCost({
    babyId: baby.id,
    costDate: '2026-06-20',
    category: 'Consultation',
    description: 'Pediatric consultation',
    amount: 45,
  });
}

try {
  seed();
  console.log('Seed completed successfully');
} catch (error) {
  console.log('Seed skipped or failed:', error instanceof Error ? error.message : error);
}
