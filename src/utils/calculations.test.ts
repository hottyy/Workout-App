import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateEpley1RM, 
  calculateBMI, 
  formatPace, 
  calculateSpeedKmh, 
  formatDuration, 
  calculateWorkingVolume 
} from './calculations.ts';

test('calculateBMI calculates correct BMI', () => {
  // 83.2 kg at 182 cm -> 83.2 / (1.82^2) = 25.118... -> 25.1
  const bmi = calculateBMI(83.2, 182);
  assert.equal(bmi, 25.1);

  // 70 kg at 175 cm -> 70 / (1.75^2) = 22.857... -> 22.9
  assert.equal(calculateBMI(70, 175), 22.9);

  // Invalid inputs return 0
  assert.equal(calculateBMI(0, 180), 0);
  assert.equal(calculateBMI(75, 0), 0);
});

test('calculateEpley1RM calculates estimated 1RM using Epley formula', () => {
  // 110 kg for 4 reps: 110 * (1 + 4/30) = 110 * 1.13333 = 124.666... -> 124.7
  const est1RM = calculateEpley1RM(110, 4);
  assert.equal(est1RM, 124.7);

  // 1 rep returns the weight itself
  assert.equal(calculateEpley1RM(150, 1), 150);

  // Reps > 15 returns 0 to prevent skewed endurance estimates
  assert.equal(calculateEpley1RM(50, 20), 0);
  assert.equal(calculateEpley1RM(0, 5), 0);
});

test('calculateSpeedKmh calculates accurate speed', () => {
  // 5 km in 25 min (1500 seconds) -> 12 km/h
  const speed = calculateSpeedKmh(5.0, 1500);
  assert.equal(speed, 12.0);

  // 10 km in 50 min (3000 seconds) -> 12 km/h
  assert.equal(calculateSpeedKmh(10, 3000), 12.0);
});

test('formatPace returns correct M:SS format', () => {
  // 1500s / 5km = 300 seconds/km -> 5:00
  assert.equal(formatPace(300), '5:00');

  // 320 seconds/km -> 5:20
  assert.equal(formatPace(320), '5:20');

  // 285 seconds/km -> 4:45
  assert.equal(formatPace(285), '4:45');
});

test('formatDuration formats seconds to MM:SS and HH:MM:SS', () => {
  assert.equal(formatDuration(1500), '25:00');
  assert.equal(formatDuration(3665), '1:01:05');
  assert.equal(formatDuration(45), '00:45');
});

test('calculateWorkingVolume calculates working volume only from completed sets', () => {
  const sets = [
    { type: 'warmup', weight: 60, reps: 10, completed: true },   // Ignored (warmup)
    { type: 'working', weight: 100, reps: 5, completed: true },  // 500
    { type: 'working', weight: 105, reps: 5, completed: true },  // 525
    { type: 'working', weight: 110, reps: 4, completed: true },  // 440
    { type: 'working', weight: 115, reps: 3, completed: false }, // Ignored (not completed)
  ];
  const vol = calculateWorkingVolume(sets);
  assert.equal(vol, 1465); // 500 + 525 + 440
});
