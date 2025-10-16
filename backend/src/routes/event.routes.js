import express from 'express';
import { body } from 'express-validator';
import Event from '../models/Event.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all events for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      userId: req.user._id,
      isActive: true
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error fetching events',
        status: 500
      }
    });
  }
});

// Get single event
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Event not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error fetching event',
        status: 500
      }
    });
  }
});

// Create new event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      userId: req.user._id
    };

    // Generate confirmation codes for guests
    if (eventData.guests && eventData.guests.length > 0) {
      const event = new Event(eventData);
      eventData.guests = eventData.guests.map(guest => ({
        ...guest,
        confirmationCode: event.generateConfirmationCode(guest.name)
      }));
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error creating event',
        status: 500
      }
    });
  }
});

// Update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
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

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        event[key] = req.body[key];
      }
    });

    await event.save();

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error updating event',
        status: 500
      }
    });
  }
});

// Delete event (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Event not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Event deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error deleting event',
        status: 500
      }
    });
  }
});

// Get event statistics
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
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

    const stats = {
      totalGuests: event.guests.length,
      confirmed: event.guests.filter(g => g.confirmed).length,
      pending: event.guests.filter(g => !g.confirmed).length,
      attended: event.guests.filter(g => g.attended).length,
      totalCompanions: event.guests.reduce((sum, g) => sum + g.companions, 0)
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error fetching statistics',
        status: 500
      }
    });
  }
});

export default router;
