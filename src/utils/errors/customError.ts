class CustomError extends Error {
    public constructor(
      message: string, 
      public status: number,
    ) {
      super(message);
      this.name = "CustomError";
    }
}

export { CustomError };