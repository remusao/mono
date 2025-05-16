export const PREFIX = 'MIME_TYPE_STUB';

export type Resource = {
  name: `${typeof PREFIX}.${string}`;
  contentType: string;
  aliases: readonly string[];
  body: string;
};
