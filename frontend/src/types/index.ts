
export interface Group {
  id: number;
  title: string;
}

export interface CreateGroupDto {
  title: string;
}

export interface UpdateGroupDto {
  id: number;
  title: string;
}

export interface Note{
  id: number;
  title: string;
  description: string;
  groupId: number;
}

export interface CreateNoteDto {
  title: string;
  description?: string;
  groupId: number;
}

export interface UpdateNoteDto {
  id: number;
  title: string;
  description: string;
  groupId: number;
}


