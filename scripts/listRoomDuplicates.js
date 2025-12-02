const { connectDB } = require('../config/db');
const mongoose = require('mongoose');
const Room = require('../models/Room');

(async () => {
  try {
    await connectDB();

    // Aggregate roomNumbers and count occurrences
    const duplicates = await Room.aggregate([
      { $group: { _id: '$roomNumber', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } },
      { $project: { roomNumber: '$_id', count: 1, ids: 1, _id: 0 } }
    ]);

    if (!duplicates.length) {
      console.log('No duplicate roomNumber values found.');
      process.exit(0);
    }

    console.log('Found duplicates:');
    duplicates.forEach(d => {
      console.log(`roomNumber=${d.roomNumber} count=${d.count}`);
      console.log('ids:', d.ids.join(', '));
    });

    console.log('\nReview the duplicates above. Run a migration script to remove or merge duplicates once you decide how to resolve them.');
    process.exit(0);
  } catch (err) {
    console.error('Error listing duplicates:', err);
    process.exit(1);
  }
})();
