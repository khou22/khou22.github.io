export type PhotoMoveRequest = {
  photo_id: string;

  /**
   * Relative path from the root of the /docs folder.
   */
  dest_path: string;
};
