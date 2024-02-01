/* eslint-disable prettier/prettier */
export interface Strategy<T> {
  saveImage(id: number, image: Buffer, title: string): Promise<T>;
}
