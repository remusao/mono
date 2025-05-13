export const namePrefix = 'MIME_TYPE_STUB';

export type Resource = {
  name: `${typeof namePrefix}.${string}`;
  contentType: string;
  aliases: readonly string[];
  body: string;
};
