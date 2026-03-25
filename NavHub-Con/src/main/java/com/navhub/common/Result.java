package com.navhub.common;

import lombok.Data;

/**
 * 统一响应格式
 * 符合前端约定的格式：{ code, message, data }
 */
@Data
public class Result<T> {
    /**
     * 响应码：0 表示成功，其他表示失败
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    private Result() {}
    
    /**
     * 成功响应
     */
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.code = 0;
        result.message = "ok";
        result.data = data;
        return result;
    }
    
    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return success(null);
    }
    
    /**
     * 失败响应
     */
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.code = 1;
        result.message = message;
        result.data = null;
        return result;
    }
    
    /**
     * 失败响应（带错误码）
     */
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.code = code;
        result.message = message;
        result.data = null;
        return result;
    }
}
