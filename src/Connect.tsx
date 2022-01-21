import { useConnect } from 'pelm-connect';

type Props = {
    connectToken: string;
    onSuccess: (authorizationCode: string) => void;
    onExit: () => void;
}

const Connect = (props: Props) => {
    const config = {
        token: props.connectToken,
        onSuccess: props.onSuccess,
        onExit: props.onExit,
    };

    const { open, ready, error } = useConnect(config);

    return (
        <>
            {/* <div className='modal-overlay'>test testests</div> */}
            <button
                type="button"
                // className="button"
                onClick={() => open()}
                // disabled={!ready || error}
                disabled={!ready}
            >
                Connect your utility
            </button>
        </>
        
    )
}

export default Connect