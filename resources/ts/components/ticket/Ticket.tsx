import { QRCodeCanvas} from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { siteURL } from '../../constants/site';



type Props = {
    ticketNumber: number;
    title: string;
    username: string;
    nickname: string;
    url: string;
    imgPass: string;
    jumpToLink: boolean;
};

const Ticket = (props: Props) => {
    let navigate = useNavigate();

    return (
        <div className='ticket_contaienr' onClick={()=> (props.url  && props.jumpToLink) && navigate(`${props.url}`)}>
            <div className="left">
                <div 
                    className="img" 
                    style={{
                        backgroundSize: "cover !important",
                        backgroundImage: `${props.imgPass ? `url(${props.imgPass})` : ""}`,
                        // backgroundColor: "#fbfbfb"
                    }}
                >
                    <div className='qr'>
                        <QRCodeCanvas
                        // <QRCodeSVG 
                            bgColor='transparent'
                            fgColor='#fff'
                            // fgColor='#50495c'
                            id="qr_code"
                            value={siteURL+props.url} 
                            size={55}
                            includeMargin={true}
                        /> 
                    </div>
                    <p className="admit_one">
                        <span>ADMIT ONE</span>
                    </p>
                    <div className="ticket_number">
                        <p>#{props.ticketNumber}</p>
                    </div>
                </div>
                <div className="ticket_content">
                    <div className="ticket_title">{props.title}</div>
                    <div className="titket_publisher">{props.nickname}</div>
                    <div className="titket_publisher_id">@{props.username}</div>
                </div>

            </div>
            <div className="center"></div>
            <div className="right">
                <div className="dashed_wrapper">
                    <div className="dashed"></div>
                </div>
                <div className="admit_one_wrapper">
                    <div className="admit_one">
                        <span>ADMIT ONE</span>

                    </div>
                    <div className="content">
                        <p className="ticket_number">#{props.ticketNumber}</p>

                        <QRCodeCanvas
                        // <QRCodeSVG 
                            bgColor='transparent'
                            fgColor='#000'
                            
                            id="qr_code"
                            value={siteURL+props.url} 
                            size={40}
                            includeMargin={true}
                        /> 
                    </div>
                </div>
                
            </div>
        </div>
    )
};

export default Ticket;