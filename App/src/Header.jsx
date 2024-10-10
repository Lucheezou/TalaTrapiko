import './Header.css'
import { useEffect, useMemo } from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Articles } from './Articles';
import { Analysis } from './Analysis';
import logo from './assets/logo_1.png';
import help1 from './assets/1.png';
import help2 from './assets/2.png';
import help3 from './assets/3.png';
import help4 from './assets/4.png';
import help5 from './assets/5.png';
import help6 from './assets/6.png';
import help7 from './assets/7.png';
import help8 from './assets/8.png';

 /*
OBJECTS : {
    index: int,
    text: string,
    html: string,
    PERSON:[],
    etcLABEL:[],
}

*/

const getLabels = (input) => {

    let articleobjects = [];
    let articles = input.trim().split('---');
    articles.forEach((item,index,arr)=>{arr[index] = item.trim()})
    articles.map((item,index)=>{
        
        if(item == ""){
            return
        }

        articleobjects.push({
        "index": index,
        "text":item})})
    
    articleobjects.forEach((item,index,arr)=>{

        

        fetch('http://127.0.0.1:8000/ner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"text":item.text})
        })
        .then(response => response.json())
        .then(data=>{ 
            
            data.ents.forEach((entry)=>{

                
                arr[index].html = data.html
                if (item.hasOwnProperty(entry.label)){
                    console.log(entry.label)
                    arr[index][entry.label].push(entry.ent)
                }
                else{
                    arr[index][entry.label] = []
                    arr[index][entry.label].push(entry.ent)
                }
            })
            if (index === articleobjects.length - 1){
                toast.success("Na-load ang mga prediksyon")
            }
        })

    })
    
    return articleobjects

}



function Header (){

    

    const [showOverlay, setShowOverlay] = useState(false);

    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };

    const notify = () => {
        toast.info("Naglo-load ang mga Prediksyon")
        toast.info("Naglo-load ang Pagsusuri")
      };
    
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [articleobjects, changeArticles] = useState(null)
    const [menu, changeMenu] = useState("Articles")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen2, setIsPopupOpen2] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [isFresh, changeFresh] = useState(false);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupOpen2 = () => {
        setIsPopupOpen2(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const handlePopupClose2 = () => {
        setIsPopupOpen2(false);
    };

    const handleSubmit = () => {
        changeArticles(getLabels(inputValue))
        setInputValue('');
        setIsPopupOpen(false);
    };

    const handleSubmit2 = () => {
        
        let urls = inputValue2.split("\n")
        let data = {"urls":urls}
        
        toast.info("Nag Loload ang mga URL");
        fetch('http://127.0.0.1:8000/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
           }).then((response)=>response.text()).catch(err=>{console.log(err); toast.error("Error sa pag-load ng URL")}).then((result)=>{

            console.log(result);
            result = result.replace(/^"(.*)"$/, '$1');
            result = result.replace(/\\n/g, '\n');
            result = result.replace(/\\/g, '');
            
            console.log(result)
            changeArticles(getLabels(result)); 
            toast.success("Naload na ang mga URL")
          

            }) ;

        setInputValue2('');
        setIsPopupOpen2(false);
    };

    const handleChangeInput = (event) => {
        setInputValue(event.target.value);
    };

    const handleChangeInput2 = (event) => {
        setInputValue2(event.target.value);
    };

    function handleChange(event) {
        if (articleobjects){
            changeFresh(false)
        }
        const reader = new FileReader();
        reader.onload = (e) => {
        const text = e.target.result;
        console.log(text)
        changeArticles(getLabels(text));
        }
        reader.readAsText(event.target.files[0]);
        notify();
      };


     

    return (<>
    <div id="frame">
    <ToastContainer position="bottom-right" autoClose={5000} />
    <div id="head">
    <div id="logodiv1"><img src={logo} id="logo1" alt="Logo" /><div id="titlecontainer"><h1><span id="tala">Tala</span><span id="trapiko">Trapiko</span></h1><footer class="blockquote-footer">By BMS-NER </footer></div></div>
        <div id="divider">
        
        <div id="navcontainer">
        <a className={menu == "Articles"?'active':''} onClick={()=>{changeMenu("Articles")}}>ARTIKULO</a>
        <a className={menu == "Analysis"?'active':''} onClick={()=>{changeMenu("Analysis")}}>PAGSUSURI</a>
        </div>
        </div>
        <div id="logodiv2" ><img src={logo} id="logo2" alt="Logo" /></div>


        <div >
                            <button className="button-with-overlay" onClick={toggleOverlay}><i className="fas fa-info"></i></button>
                            {showOverlay && (
                                <div className="overlay">
                                <div className="overlay-content">

                                <div id ="overlayheader"><button className="close-button" onClick={toggleOverlay}><i className="fas fa-times"></i></button>
                                <h4>Hakbang Upang Makapagawa ng Pagsusuri</h4></div>

                                    <div className="scrollable-div">
                                      

                                        

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Pindutin ang upload at pumili ng isa sa mga pagpipilian upang magsimula.</p>
                                        <div className='helpimg'><img src={help1} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Pindutin ang 'Upload File' para makapagpili ng file o dokumento na nais gamitin. </p>
                                        <div className='helpimg'><img src={help2} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Piliin ang file o dokumento na mayroong pormat na '.txt' at pindutin ang 'Open'. </p>
                                        <div className='helpimg'><img src={help3} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Kung nais mag-input ng teksto, pindutin lamang ang 'Text Input'. </p>
                                        <div className='helpimg'><img src={help4} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>
                                        
                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> I-type ang artikulo na gusto mong suriin at pindutin ang 'Submit'.</p>
                                        <div className='helpimg'><img src={help5} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Maghintay ng ilang minuto para matapos ang pag-analisa. Sa kaliwang bahagi, makikita ang lahat ng artikulo na nai-upload. Sa gitnang bahagi makikita ang kabuuan ng na analisang artikulo. At sa kanang bahagi makikita ang mga naobserba ng mga salitang may kaugnayan sa aksidente.</p>
                                        <div className='helpimg'><img src={help6} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Pindutin ang 'Pagsusuri'. Sa kaliwang bahagi, pumili ng isa sa mga istatiska upang makita ang graph ng mga salitang may kaugnayan sa aksidente.</p>
                                        <div className='helpimg'><img src={help7} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>

                                        <div id="step">
                                        <p><i class="fa-regular fa-circle-dot"></i> Pagkatapos maipalabas ang graph, maaaring gamitin ang 'Max Entries' at 'Keyword Filter' upang maging ispesipiko ang graph ng artikulo ng iyong nais. Sa kanang bahagi naman makikita ang mga salitang may kaugnayan sa aksidente.</p>
                                        <div className='helpimg'><img src={help8} style={{ width: '100%', height: '100%'}} /></div>
                                        </div>







                                    </div>
                                </div>
                                </div>
                            )}
                            </div>


        <div className="dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => {setIsDropdownOpen(false)} }>
                        <button className="dropbtn"><i className="fas fa-cloud-upload-alt"></i> Upload</button>
                        {isDropdownOpen &&
                            <div className="dropdown-content">
                                <label for="fileInput" className="upload">
                                Upload File
                                </label>
                                <input onChange={handleChange} type="file" id="fileInput" accept=".txt,.pdf,.doc,.docx" />

                                <label className='upload' onClick={handlePopupOpen}>Text Input</label>
                                
                                <label className='upload' onClick={handlePopupOpen2}>Input URL</label>
                                

                            </div>
                        }

                                {isPopupOpen && (
                                            <div className="popup-overlay">
                                        <div className="popup-content">
                                        <textarea
                                            onChange={handleChangeInput}
                                            placeholder="Enter text"
                                           
                                        />
                                            <buttoncontainer>
                                            <button onClick={handleSubmit}>Submit</button>
                                            <button onClick={handlePopupClose}>Close</button>
                                            </buttoncontainer>
                                        </div>
                                    </div>
                                )}

                                {isPopupOpen2 && (
                                    <div className="popup-overlay">
                                        <div className="popup-content">
                                        <textarea
                                            onChange={handleChangeInput2}
                                            placeholder="Enter URL(s) seperated by a newline"
                                           
                                        />
                                            <div id="buttoncontainer">
                                            <button onClick={handleSubmit2}>Submit</button>
                                            <button onClick={handlePopupClose2}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                )}


                        

                    </div>
        
      
    </div>
    <div id="bodybox">
    {menu == "Articles"?<Articles articleobjects={articleobjects} clear={isFresh?"true":"false"}/>:<Analysis articleobjects={articleobjects} />}
    </div>



    </div>    
    </>)

}

export default Header