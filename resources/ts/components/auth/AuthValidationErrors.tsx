const AuthValidationErrors = (
    { errors = [], ...props }: { errors: any[], props?: string[] }
) => {
    return (
        <>
            {errors.length > 0 && (
                <div {...props} className="validation_errors">

                    <ul className="validation_error_messages">

                        {errors.map(error => (
                            <li key={error} className="validation_error_message">
                                {error[0]=== "auth.failed" 
                                    ? "ログインに失敗しました" 
                                    : null
                                }
                                {error[0]=== "auth.throttle" 
                                    ? "認証が一時的に制限されています" 
                                    : null
                                }
                                {error[0]=== "username.match" 
                                    ? "ユーザー名に使えるのは、半角英数字、アンダースコア（_）のみです" 
                                    : null
                                }
                                {error[0]=== "password.match" 
                                    ? "パスワードに使えるのは、半角英数字と記号（@$!%*?&）のみです" 
                                    : null
                                }
                            </li>
                        ))}
                        
                    </ul>
                    
                </div>
            )}
        </>
    )
};

export default AuthValidationErrors;