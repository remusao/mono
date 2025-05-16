import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/jpeg';

const resource: Resource = {
  name: `${PREFIX}.jpg`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.jpg', 'jpg', '.jpeg', 'jpeg'],
  body: '/9j/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/yQALCAABAAEBAREA/8wABgAQEAX/2gAIAQEAAD8A0s8g/9k=',
};
export default resource;
