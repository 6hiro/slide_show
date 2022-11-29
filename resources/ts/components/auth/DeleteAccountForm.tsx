import { USER } from '../../types/user';

type Props = {
    user: USER;
    toggle:  (nextValue?: any) => void;
    deleteAccount: Function;
};

const DeleteAccountForm = (props: Props) => {

    return (
        <form className="delete_account_form" >
            <h3 className="delete_account_form_title">
                アカウントを削除しますか？
            </h3>

            <div className="delete_account_form_content" >
                <p>
                    一度削除されたアカウントは、回復できません。
                </p>
            </div>


            <div className="button_container" >
                <button
                    type='submit'
                    className="no_button"
                    onClick={props.toggle}
                >
                    キャンセル
                </button>

                <button
                    type='submit'
                    className="yes_button"
                    disabled={ !props.user.id }
                    onClick={() => props.deleteAccount()}
                >
                    削除
                </button>

            </div>

        </form>
    )
};

export default DeleteAccountForm;