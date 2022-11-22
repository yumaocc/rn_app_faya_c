import {common} from '../apis';
import {SearchParam} from '../fst/models';

/**
 * 日志上报级别：info、warn、error、fatal
 * info: 普通信息
 * warn: 警告信息，不影响系统正常运行，优先级较低
 * error: 错误信息，影响系统正常运行，优先级较高
 * fatal: 严重错误信息，系统无法正常运行，优先级最高，需立即排查并修复
 */

function log(locate: string, params: SearchParam): void {
  common
    .report(locate, {
      level: 'log',
      ...params,
    })
    .catch(console.log);
}

function warn(locate: string, params: SearchParam): void {
  common
    .report(locate, {
      level: 'warn',
      ...params,
    })
    .catch(console.log);
}
function error(locate: string, params: SearchParam): void {
  common
    .report(locate, {
      level: 'error',
      ...params,
    })
    .catch(console.log);
}

function fatal(locate: string, params: SearchParam): void {
  common
    .report(locate, {
      level: 'fatal',
      ...params,
    })
    .catch(console.log);
}

const logger = {log, warn, error, fatal};
export default logger;
