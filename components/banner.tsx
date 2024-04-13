import { siteConfig } from "@/config/site"

function Banner({ price }: any) {
    function copy(text: string) {
        navigator.clipboard.writeText(text);
        alert("Copied to Clipboard!");
    }

    return (
        <div>
            <h1 className="break-words text-xl font-bold leading-tight sm:text-2xl md:text-3xl">
                {siteConfig.name}
                <br />
            </h1>
            <p className="break-words text-sm sm:text-base">
                {`"Buy the token fggot" -Warren Buffalo`}
            </p>
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold leading-tight sm:text-xl md:text-2xl">
                    <br />
                    Current Price:
                </h2>
                <button
                    onClick={() => window.open(siteConfig.pumpUrl, "_blank")}
                    className="break-words text-sm font-medium text-green-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 sm:text-base"
                >
                    {price}
                </button>

                <h2 className="text-lg font-semibold leading-tight sm:text-xl md:text-2xl">
                    <br />
                    Contract Address:
                </h2>

                <button
                    onClick={() => copy(siteConfig.contractAddress)}
                    className="break-words text-sm font-medium text-green-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 sm:text-base"
                >
                    {siteConfig.contractAddress.slice(0, 10)}...
                </button>
                <p className="break-words text-sm sm:text-base">
                    <br />
                    {`"${siteConfig.description}" -Everyone`}
                </p>
            </div>
        </div>
    );
}
export default Banner;
