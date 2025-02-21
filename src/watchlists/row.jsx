import React from "react";
import { useGlobal } from "reactn";
import { Tr, Td, Checkbox, Stack, Center } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Tag from "./tag";
import Axios from "axios";
import numeral from "numeral";

import { CMenu, Trigger, Content, MenuItem, VWAPSubMenu, OrderSubMenu } from ".././common/menu/context-menu";


const WatchlistRow = function(props) {

    const [selectedAsset, setSelectedAsset] = useGlobal("selectedAsset")
    const [watchlist, setWatchlist] = useGlobal("watchlist")
    const [symbolsDetails] = useGlobal("symbolsDetails")
    const [symbolHighlight] = useGlobal("symbolHighlight")
    const [ latestPrice, setLatestPrice ] = React.useState(0) 
    const [ candles ] = useGlobal("candles")

    // const [ symbolCandles, setSymbolCandles ] = React.useState([])
    const [atr, setAtr] = React.useState(0);
    const [levels] = useGlobal("levels");

    // const handleMinuteBars = React.useCallback((data) => {
    //     if (data.S === props.item.symbol) {
    //         setLatestPrice(numeral(data.p).format("0.00"))
    //     }
    // }, [selectedAsset])

    // React.useEffect(() => {
    //     let eventTargetRef = window.Main.on("stream", data => {
    //         handleMinuteBars(data)
    //     })

    //     // return () => {
    //     //     eventTargetRef.off("stream", handleMinuteBars)
    //     // }
    // }, [])

    // const handleCandles = React.useCallback( data => {
    //     setSymbolCandles(data)
    // })

    // React.useEffect(() => {
    //     socket.on("trades-"+props.item.symbol, handleMinuteBars)
    //     socket.on(props.item.symbol+".candles", handleCandles)
    //     return () => {
    //         socket.off("trades-"+props.item.symbol, handleMinuteBars)
    //         socket.off(props.item.symbol+".candles", handleCandles)
    //         // socket.off("alpaca-T", handleMinuteBars)
    //     }
    // }, [socket, handleMinuteBars])

    const deleteSymbol = async function() {
        console.log(props.item.symbol)
        

        const response = await window.Main.asyncData({
            route: "watchlists/remove-symbol",
            content: props.item.symbol

        })
        console.log(response)
        
        if (response.data) { setWatchlist(response.data) }
        else { setWatchlist(watchlist.filter(asset => asset.symbol != props.item.symbol))}
    }   


    const handleSelectedAsset = function (e) {
        setSelectedAsset(props.item.symbol);
        //console.log("symbols details", symbolsDetails)
    };


    // const highlight = (props.item.symbol == symbolHighlight) ? " transition-all duration-200 bg-yellow-500 " : "";
    
    const highlight = (props.item.symbol == symbolHighlight) ? " animate-[bounce_3s_1s] " : ""; 

    const unshortable = props.item.shortable ? null : "!s"


    // let lastCandle = {}
    // React.useEffect(() => {
    //     if (candles && candles.length > 0) {
    //         const symbolCandles = candles[props.item.symbol]
    //         lastCandle = symbolCandles[symbolCandles.length - 1]
    //         console.log(lastCandle)
    //     }
    // }, [candles])
    let td = "";
    let tdBg = "";
    const symbolCandles = candles[props.item.symbol];
    if (symbolCandles) {
        const lastCandle = symbolCandles[symbolCandles.length - 1] || {};
        // console.log(lastCandle);
        const tdUp = lastCandle.TD_SEQ_UPa;
        const tdDown = lastCandle.TD_SEQ_DNa;
        if (tdUp) {
            td = "TD-Up-" + tdUp;
            tdBg = (tdUp == 2 || tdUp == 6) ? "bg-purple-200" : "bg-green-200";
        } else if (tdDown) {
            td = "TD-Dn-" + tdDown;
            tdBg = (tdDown == 2 || tdDown == 6) ? "bg-purple-200" : "bg-red-200";
        }
    }

    return (

        <Tr className={(selectedAsset == props.item.symbol ? " bg-purple-50 " : " hover:bg-yellow-50 ") + (props.item.status ? "": " bg-red-100 ")} onClick={handleSelectedAsset}>
            <Td className={highlight}>

                <CMenu>
                    <Trigger>
                        { props.item.symbol } { unshortable && <Tag>{ unshortable }</Tag> }
                    </Trigger>
                    <Content>
                        {/* <MenuItem>Key Summary</MenuItem> */ }
                        <OrderSubMenu
                            menuTitle={ "Instant Order" }
                            symbol={ props.item.symbol }
                        >
                        </OrderSubMenu>
                        { levels[props.item.symbol] && (
                            <VWAPSubMenu
                                menuTitle={ "Price Touches VWAP" }
                                symbol={ props.item.symbol }
                                levelCode={ "VWAP_D" }
                                category={ "indicator" }
                                action={ "touches" }
                                numero={ "price" }
                                type={ "vwap" }
                                latestprice={ latestPrice }
                            >
                            </VWAPSubMenu>
                        ) }
                    </Content>
                </CMenu>
            </Td>
            {/* <Td isNumeric>{ latestPrice || props.item.lastDailyClose }</Td> */ }
            <Td> { numeral(props.item.atr).format("0") }</Td>
            <Td><span className={ tdBg + " p-1" }>{ td }</span></Td>
            <Td>
                <Stack spacing={ 2 } direction="row">
                    <DeleteIcon className="cursor-pointer hover:text-red-500" onClick={ deleteSymbol } title="Delete Symbol" />
                    {/* <EditIcon className="cursor-pointer hover:text-blue-500" title="Edit Symbol" /> */ }
                </Stack>
            </Td>
        </Tr>
    );
};

export default WatchlistRow;