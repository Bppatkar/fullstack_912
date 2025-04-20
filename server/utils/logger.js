import Log from '../models/log.model.js';

export const logAction = async (action, message, metadata = {}) => {
  try {
    await Log.create({
      action,
      message,
      ...metadata
    });
  } catch (error) {
    console.error('Logging error:', error);
  }
};

export const getLogs = async (filter = {}) => {
  return await Log.find(filter).sort({ createdAt: -1 });
};