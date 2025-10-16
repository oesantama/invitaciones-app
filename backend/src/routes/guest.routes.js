import express from 'express';
import Event from '../models/Event.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route: Get event and guest info by confirmation code (for invitations)
router.get('/invitation/:eventId/:confirmationCode', async (req, res) => {
  try {
    const { eventId, confirmationCode } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      isActive: true,
      'guests.confirmationCode': confirmationCode
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Invitation not found',
          status: 404
        }
      });
    }

    const guest = event.guests.find(g => g.confirmationCode === confirmationCode);

    res.json({
      success: true,
      data: {
        event: {
          _id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          hosts: event.hosts,
          schedule: event.schedule,
          theme: event.theme,
          media: event.media,
          settings: event.settings
        },
        guest
      }
    });
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error fetching invitation',
        status: 500
      }
    });
  }
});

// Public route: Confirm attendance
router.post('/confirm/:eventId/:confirmationCode', async (req, res) => {
  try {
    const { eventId, confirmationCode } = req.params;
    const { companions, menuType } = req.body;

    const event = await Event.findOne({
      _id: eventId,
      isActive: true,
      'guests.confirmationCode': confirmationCode
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Invitation not found',
          status: 404
        }
      });
    }

    const guest = event.guests.find(g => g.confirmationCode === confirmationCode);
    if (!guest) {
      return res.status(404).json({
        error: {
          message: 'Guest not found',
          status: 404
        }
      });
    }

    // Update guest
    guest.confirmed = true;
    guest.confirmedAt = new Date();
    if (companions !== undefined) guest.companions = companions;
    if (menuType) guest.menuType = menuType;

    await event.save();

    res.json({
      success: true,
      data: {
        message: 'Attendance confirmed successfully',
        guest
      }
    });
  } catch (error) {
    console.error('Confirm attendance error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error confirming attendance',
        status: 500
      }
    });
  }
});

// Protected route: Mark guest as attended (scanner)
router.post('/:eventId/:guestId/attend', authMiddleware, async (req, res) => {
  try {
    const { eventId, guestId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Event not found',
          status: 404
        }
      });
    }

    const guest = event.guests.id(guestId);
    if (!guest) {
      return res.status(404).json({
        error: {
          message: 'Guest not found',
          status: 404
        }
      });
    }

    guest.attended = true;
    await event.save();

    res.json({
      success: true,
      data: {
        message: 'Guest marked as attended',
        guest
      }
    });
  } catch (error) {
    console.error('Mark attended error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error marking attendance',
        status: 500
      }
    });
  }
});

// Protected route: Add guest to event
router.post('/:eventId/guests', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, phone, email } = req.body;

    const event = await Event.findOne({
      _id: eventId,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Event not found',
          status: 404
        }
      });
    }

    const confirmationCode = event.generateConfirmationCode(name);
    const newGuest = {
      name,
      phone,
      email,
      confirmationCode
    };

    event.guests.push(newGuest);
    await event.save();

    res.status(201).json({
      success: true,
      data: {
        guest: event.guests[event.guests.length - 1]
      }
    });
  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error adding guest',
        status: 500
      }
    });
  }
});

export default router;
