import { useConnect } from 'pelm-connect';

import { Config } from "pelm-connect/dist/types/index";


type Props = {
    connectToken: string;
    onSuccess: (authorizationCode: string) => void;
    onExit: () => void;
}

const Connect = (props: Props) => {

    const onSuccess =
        () => {
            console.log("onSuccess from App")
        };

    const onExit =
        () => console.log('onExit from App.js');

    const config = {
        token: props.connectToken,
        onSuccess: props.onSuccess,
        onExit: props.onExit,
    };

    const { open, ready, error } = useConnect(config);

    return <button
        type="button"
        className="button"
        onClick={() => open()}
        // disabled={!ready || error}
        disabled={!ready}
    >
        Connect your utility
    </button>
}

export default Connect