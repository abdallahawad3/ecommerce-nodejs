class AppError extends Error {
  public statusCode: number;
  public status: string;
  constructor(message: string, statusCode: number, name: string = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.name = name;
  }
}
export default AppError;
