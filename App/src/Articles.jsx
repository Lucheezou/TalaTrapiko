import { useEffect, useRef } from 'react';
import { useState } from 'react';

export function Articles(props) {
    
    let articleobjects = props.articleobjects;
    const viewbox = useRef("");
    const selectedref = useRef(null);
    const [activeIndex, changeIndex] = useState(null);
    const [search, changeSearch] = useState("");
    const [selected, changeSelected] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState({"PER":false,"VEH":false,"DATE":false,"INJ":false,"VIS":false,"DAY":false,"MONTH":false,"ACC":false,"CAUSE":false,"TIME":false,"GEND":false,"LOC":false,"INJCOUNT":false,"AGE":false,});
    const [content, setContent] = useState('')
    const labelboxref = useRef('')

    const renderonce = (arrayz) => {

        if (!arrayz) return

        const renderedItems = {};
        let result;
        console.log(arrayz)
        
        arrayz.forEach((item)=>{
        const specialCharsRegex = /[`!@#$%^&*()_+=\[\]{};"\\|.<>\/?~]/g;
        item = item.replace(specialCharsRegex, '');
        item = item.toUpperCase();

        if (item in renderedItems){
            renderedItems[item]++
        }

        else renderedItems[item] = 1

        })

        result = Object.entries(renderedItems).map(entry =>{
            const [key, value] = entry
            return (<div className='content'>
                <span>{key}</span>
                <span>{value}</span>
              </div>)
        })

        return result
        
      }

    useEffect(()=>{setContent("<div style='display:flex;height:100%;width:100%;justify-content:center;align-items:center;font-weight:bold;text-decoration-line: underline;line-height: 3.5;text-decoration-color: #FFA500;font-size:32px'>Pumili ng artikulo na nais i-analysa</div>")},[props.articleobjects])

    const toggleCollapse = (string) => {
        let collapsed = {...isCollapsed}
        collapsed[string] = !collapsed[string]
        setIsCollapsed(collapsed);
    };

    const handleSelect = (index) => {
        changeIndex(index);
        selectedref.current = articleobjects[index];
        changeSelected(articleobjects[index]);


        if (articleobjects[index].html) {
            setContent(selectedref.current.html);
        }
        else {
            setContent(`<div class="spinner-grow" role="status" style="align-self:center">
            </div>`)
            const loadviewbox = setInterval(() => {
                if (articleobjects[index].html) {
                    setContent(selectedref.current.html);
                    clearInterval(loadviewbox);
                }
            }, 1000);

        }
    };

    


    if (props.articleobjects != null) {
        
        console.log(articleobjects);
        
        return (<>
            <div id="articles" >

                <div id="searchbarcontainer">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type='text' placeholder="Search" id="searchbar" onChange={(e) => { changeSearch(e.target.value); }}></input>
                </div>
                
                <div id="articlescontainer">
                <p>Mga Artikulo</p>
                {articleobjects.map((item, index) => {
                    return item.text.toLowerCase().includes(search.toLowerCase()) ? <div class={`article ${index == activeIndex?'selectedarticle':'null'}`} onClick={() => handleSelect(index)}><span class="dot"></span>{item.text}</div> : <div></div>;
                })}
                </div>
            </div>

            <div id="viewbox" dangerouslySetInnerHTML={{ __html: content }} ref={viewbox}></div>

            <div id="labelbox" ref={labelboxref}>  


                {selected && <div id="labelboxheader">Naobserba</div>}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("PER")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("PER")}>
                                    <p>TAO (PER)</p>
                                    <div id="PERSONCOLOR"></div>
                                    <p>{isCollapsed.PER?<i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                
                                {!isCollapsed.PER &&
                                    renderonce(selected.PER)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("LOC")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("LOC")}>
                                    <p>LUGAR (LOC)</p>
                                    <div id="LOCCOLOR"></div>
                                    <p>{isCollapsed.LOC ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.LOC &&
                                    renderonce(selected.LOC)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                 {/*START Repeat Per Label*/}
                 {(() => {
                    if (selected != null && selected.hasOwnProperty("DATE")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("DATE")}>
                                    <p>PETSA (DATE)</p>
                                    <div id="DATECOLOR"></div>
                                    <p>{isCollapsed.DATE ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.DATE &&
                                    renderonce(selected.DATE)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("TIME")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("TIME")}>
                                    <p>ORAS (TIME)</p>
                                    <div id="TIMECOLOR"></div>
                                    <p>{isCollapsed.TIME ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.TIME &&
                                    renderonce(selected.TIME)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("VEH")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("VEH")}>
                                    <p>BEHIKULO (VEH)</p>
                                    <div id="VEHCOLOR"></div>
                                    <p>{isCollapsed.VEH ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.VEH &&
                                    renderonce(selected.VEH)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("INJ")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("INJ")}>
                                    <p>PINSALA (INJ)</p>
                                    <div id="INJCOLOR"></div>
                                    <p>{isCollapsed.INJ ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.INJ &&
                                    renderonce(selected.INJ)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("INJCOUNT")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("INJCOUNT")}>
                                    <p>BILANG (INJCOUNT)</p>
                                    <div id="INJCOUNTCOLOR"></div>
                                    <p>{isCollapsed.INJCOUNT ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.INJCOUNT &&
                                    renderonce(selected.INJCOUNT)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("VIS")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("VIS")}>
                                    <p>TANAW (VIS)</p>
                                    <div id="VISCOLOR"></div>
                                    <p>{isCollapsed.VIS ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.VIS &&
                                    renderonce(selected.VIS)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("ACC")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("ACC")}>
                                    <p>AKSIDENTE (ACC)</p>
                                    <div id="ACCCOLOR"></div>
                                    <p>{isCollapsed.ACC ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.ACC &&
                                    renderonce(selected.ACC)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("DAY")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("DAY")}>
                                    <p>ARAW (DAY)</p>
                                    <div id="DAYCOLOR"></div>
                                    <p>{isCollapsed.DAY ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.DAY &&
                                    renderonce(selected.DAY)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("CAUSE")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("CAUSE")}>
                                    <p>DAHILAN (CAUSE)</p>
                                    <div id="CAUSECOLOR"></div>
                                    <p>{isCollapsed.CAUSE ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.CAUSE &&
                                    renderonce(selected.CAUSE)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("GEND")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("GEND")}>
                                    <p>KASARIAN (GEND)</p>
                                    <div id="GENDCOLOR"></div>
                                    <p>{isCollapsed.GEND ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.GEND &&
                                    renderonce(selected.GEND)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("MONTH")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("MONTH")}>
                                    <p>BUWAN (MONTH)</p>
                                    <div id="MONTHCOLOR"></div>
                                    <p>{isCollapsed.MONTH ? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                
                                {!isCollapsed.MONTH &&
                                    renderonce(selected.MONTH)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}

                {/*START Repeat Per Label*/}
                {(() => {
                    if (selected != null && selected.hasOwnProperty("AGE")) {
                        return (
                            <div className="collapsibleb">
                                <div className="header" onClick={()=>toggleCollapse("AGE")}>
                                    <p>EDAD (AGE)</p>
                                    <div id="AGECOLOR"></div>
                                    <p>{isCollapsed.AGE? <i class="fa-solid fa-plus"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                </div>
                                {!isCollapsed.AGE &&
                                    renderonce(selected.AGE)}
                            </div>);
                    }
                }
                )()}
                {/*END Repeat Per Label*/}


            </div>
        </>
        );
    }
    
    else {
        return (<>
            <div id="articlesb"><p id='articlesblank'>Dito lalabas ang mga teksto</p></div>
            <div id="viewboxb" ref={viewbox}><p>Dito lalabas ang piniling teksto</p></div>
            <div id="labelboxb"><p id='articlesblank'>Dito lalabas ang mga naobserba</p></div>
        </>
        );
    }
}
