package com.navhub.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * 统一处理异常，返回友好的错误信息
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 处理请求体缺失或格式错误
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        String message = e.getMessage();
        if (message != null && message.contains("Required request body is missing")) {
            return Result.error(400, "请求体不能为空，请检查 Content-Type 是否为 application/json");
        }
        return Result.error(400, "请求体格式错误，请检查 JSON 格式是否正确");
    }
    
    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.OK)
    public Result<Void> handleRuntimeException(RuntimeException e) {
        return Result.error(e.getMessage());
    }
    
    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e) {
        e.printStackTrace(); // 打印异常堆栈，便于调试
        return Result.error(500, "服务器内部错误：" + e.getMessage());
    }
}
