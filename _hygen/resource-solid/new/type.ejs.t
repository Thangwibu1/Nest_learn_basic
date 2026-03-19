---
to: <%= path %>/<%= name %>/types/<%= name %>.type.ts
---
export type <%= h.changeCase.pascal(name) %>Type = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

