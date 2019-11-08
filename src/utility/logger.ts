import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format

export class ApiLogger {
  public static myFormat = printf(info => {
    return `[${info.timestamp}] [${info.level}] => [${info.message}]`
  })
  public static logger = createLogger({
    format: combine(
      label({ label: 'Order API' }),
      timestamp(),
      ApiLogger.myFormat
    ),
    transports: [
      // Để log ra 1 file tên là fuck.log
      new transports.File({ filename: 'fuck.log' }),
      // Để log ra console
      new transports.Console(),
    ],
  })
}
