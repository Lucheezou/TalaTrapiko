import { useRef } from 'react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from "recharts";
  

function locations(articleobjects, option, number, keyword, search){

    if (number == null){
      number = 5;
    }

    if (keyword == null){
      keyword = "";
    }
    
    if(!articleobjects){
        return(<></>)
    }
    
    
    function highest(obj) {
        // Extract keys and values from the object
        const entries = Object.entries(obj);
        
        // Sort entries by values in descending order
        entries.sort((a, b) => b[1] - a[1]);
        
        // Slice the first 5 entries to get the top 5 highest numbers
        const top = entries.slice(0, number);
        
        // Extract keys and values from the top 5 entries
         let result = [];
         top.forEach(([key, value]) => {
         result.push({name:key,
         count: value
         });
         });
        
        return result;
      }
    
    
    let list = {}
    articleobjects.forEach((item)=>{
        if(item.LOC){
        item.LOC.forEach((item)=>{
          const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
          item = item.replace(specialCharsRegex, '')
          item = item.toUpperCase();
            if(list.hasOwnProperty(item)){
            list[item]++
            }
            else{if(item.toLowerCase().includes(keyword.toLowerCase())){list[item] = 1}}
        })}
    })



    let data = highest(list)


    if (option == 0){
            return(<>
              <div id="locationsref" style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
              
            
              <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
              <ResponsiveContainer width="100%" height="100%" aspect={0}>
              <BarChart
                width={800}
                height={350}
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 5
                }}
                style={{ position:'relative', right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fc6d15" />
              </BarChart>
              </ResponsiveContainer>
              </div>
          
              </div>
              </>)}

      else{return(<div className="collapsible" id="statsref">
            <div className="headernop">
            <p>Lokasyong Nabanggit</p>
            </div>
        
          {
            true &&
            Object.entries(list).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
              return key.toLowerCase().includes(search.toLowerCase())?
              <div className="contentb">
                <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
              </div>:""
              }
            )
          }

          </div>)}

}

function injuries(articleobjects, option, filter){

  const customTooltipPosition = (coords, params, domNode, rect) => {
    const { width, height } = rect;
    let x = coords.x - width - 300; // Adjust this value to your preference
    let y = coords.y - height / 5;
  
    // Ensure tooltip doesn't go beyond the left edge of the chart
    if (x < 0) {
      x = coords.x + 10; // Show tooltip to the right if it would go off-screen
    }
  
    // Ensure tooltip doesn't go beyond the top or bottom edge of the chart
    if (y < 0) {
      y = 0;
    } else if (y + height > rect.parent.clientHeight) {
      y = rect.parent.clientHeight - height;
    }
  
    return { x, y };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFAAFF'];

  function inttostring(str){
    const numStr = str.match(/\d+(\.\d+)?/);
    return numStr ? parseFloat(numStr[0]) : null;
  }
  
  if(!articleobjects){
      return(<></>)
  }
  
  let data = {
    INJ:[],
    GEND:[],
    AGE:[]
  };
  let list1 = {}; 
  let list2 = {
    male: 0,
    female: 0
  };
  let list3 = {
    children:0,
    teenagers:0,
    youngadults:0,
    adults:0,
    seniors:0,
  }

  articleobjects.forEach((item)=>{
      if(item.INJ){
        
      item.INJ.forEach((item)=>{
        const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
          item = item.replace(specialCharsRegex, '')
          item = item.toUpperCase();
          if(list1.hasOwnProperty(item)){
          list1[item]++
          }
          else{list1[item] = 1}
      })}
  })

  articleobjects.forEach((item)=>{
    if(item.INJ && item.GEND){
      item.GEND.forEach((item)=>{
        const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
        item = item.replace(specialCharsRegex, '')
        item = item.toUpperCase();
        if (item.toLowerCase().includes("babae") || item.toLowerCase().includes("babaeng") || item.toLowerCase().includes("dalaga") || item.toLowerCase().includes("dalagita")){
          list2.female = list2.female + 1;
        }
        else{list2.male = list2.male + 1;}
      })}})
      
  articleobjects.forEach((item)=>{
    
        if(item.INJ && item.AGE){
          item.AGE.forEach((item)=>{
            const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
            item = item.replace(specialCharsRegex, '')
            if(inttostring(item) <= 12){
              list3.children = list3.children + 1
            }
            if(inttostring(item) >= 13 && inttostring(item) <= 19){
              list3.teenagers = list3.teenagers + 1
            }

            if(inttostring(item) >= 20 && inttostring(item) <= 34){
              list3.youngadults = list3.youngadults + 1
            }

            if(inttostring(item) >= 35 && inttostring(item) <= 64){
              list3.adults = list3.adults + 1
            }

            if(inttostring(item) >= 65){
              list3.seniors = list3.seniors + 1
            }


          })}})

  Object.entries(list1).map(([key,value])=>(
    data.INJ.push({name:key, count: value})
  ))

  Object.entries(list2).map(([key,value])=>(
    data.GEND.push({name:key, count: value})
  ))

  Object.entries(list3).map(([key,value])=>(
    data.AGE.push({name:key, count: value})
  ))
  
  const totalAGE = data.AGE.reduce((total, item) => total + item.count, 0);
  const totalGEND = data.GEND.reduce((total, item) => total + item.count, 0);
  
  if (option == 0){
    return(<> 
    <div style={{ display: 'flex'}}>
    
    {filter == "AGE"?<>
    <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
    
    <div style={{ display: 'flex', height:'300px',width:'300px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={1}>
    <PieChart>
      <Pie
        data={data[filter]}
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={50}
        fill="#8884d8"
        dataKey="count"
      >
        {data.AGE.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip position={customTooltipPosition} formatter={(count, name, props) => [`${name} percent: ${(count / totalAGE * 100).toFixed(2)}%` ]} />
      <Legend align="right"
        verticalAlign="middle"
        layout="vertical"
        iconSize={10}
        contentStyle={{ fontSize: '12px' }} />
      <text x="50%" y="80%" textAnchor="left" dominantBaseline="middle">Total : {totalAGE} </text>
    </PieChart>
    </ResponsiveContainer>
    </div>

    <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'500px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={0}>
    <BarChart
      width={800}
      height={350}
      data={data[filter]}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 5
      }}
      style={{ position:'relative', right: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#fc6d15" />
    </BarChart>
    </ResponsiveContainer>
    </div>

    </div>
    </>:"" }

    {filter == "GEND"?<>
    <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
    
    <div style={{ display: 'flex', height:'300px',width:'300px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={1}>
    <PieChart>
      <Pie
        data={data[filter]}
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={50}
        fill="#8884d8"
        dataKey="count"
      >
        {data.AGE.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip position={customTooltipPosition} formatter={(count, name, props) => [`${name} percent: ${(count / totalAGE * 100).toFixed(2)}%` ]} />
      <Legend align="right"
        verticalAlign="middle"
        layout="vertical"
        iconSize={10}
        contentStyle={{ fontSize: '12px' }} />
      <text x="50%" y="80%" textAnchor="left" dominantBaseline="middle">Total : {totalAGE} </text>
    </PieChart>
    </ResponsiveContainer>
    </div>

    <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'500px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={0}>
    <BarChart
      width={800}
      height={350}
      data={data[filter]}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 5
      }}
      style={{ position:'relative', right: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#fc6d15" />
    </BarChart>
    </ResponsiveContainer>
    </div>

    </div>
    </>:"" }
   
    {filter == "INJ"?<>
    <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
    
  
    <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={0}>
    <BarChart
      width={800}
      height={350}
      data={data[filter]}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 5
      }}
      style={{ position:'relative', right: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#fc6d15" />
    </BarChart>
    </ResponsiveContainer>
    </div>

    </div>
    </>:""}


    </div>
   
    </>)}

    else{return (<div className="collapsible" id="statsref">
          <div className="headernop">
          <p>Pinsalang Nabanggit</p>
          </div>
      
      
      {true &&
          Object.entries(list1).sort((a, b) => b[1] - a[1]).map(([key, value]) => (
            <div className="contentb">
                <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
            </div>))}
      </div>)}

}

function causes(articleobjects, option, filter, number, keyword){

  if(!articleobjects){
    return(<></>)
}

  if (number == null){
    number = 5;
  }

  if (keyword == null){
    keyword = "";
  }

  

  function highest(obj) {
    // Extract keys and values from the object
    const entries = Object.entries(obj);
    
    // Sort entries by values in descending order
    entries.sort((a, b) => b[1] - a[1]);
    
    // Slice the first 5 entries to get the top 5 highest numbers
    const top = entries.slice(0, number);
    
    // Extract keys and values from the top 5 entries
     let result = [];
     top.forEach(([key, value]) => {
     result.push({name:key,
     count: value
     });
     });
    
    return result;
  }
  
  
  
  let list = {}; 

  

  

  articleobjects.forEach((item)=>{
      if(item.CAUSE){
      
      for (var loc in item.LOC){  
        if(item.LOC[loc].toLowerCase().includes(keyword.toLowerCase())){
          item.CAUSE.forEach((item)=>{
            const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
            item = item.replace(specialCharsRegex, '')
            item = item.toUpperCase();
            if(list.hasOwnProperty(item)){
            list[item]++
            }
            else{list[item] = 1}
        })
        break;
        }
      }
      }
  })

  let data = highest(list)

  
  /*Object.entries(list).map(([key,value])=>(
    data.push({name:key, count: value})
  ))*/

  

  
  if (option == 0){
    return(<> 
    <div style={{ display: 'flex'}}>
    
    {filter == "CAUSE"?<>
    <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
    
    <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
    <ResponsiveContainer width="100%" height="100%" aspect={0}>
    <BarChart
      width={800}
      height={350}
      data={data}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 5
      }}
      style={{ position:'relative', right: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#fc6d15" />
    </BarChart>
    </ResponsiveContainer>
    </div>

    </div>
    </>:"" }

    


    </div>
   
    </>)}

    else{return (<div className="collapsible" id="statsref">
          <div className="headernop">
          <p>Dahilang Nabanggit</p>
          </div>
      
      
      {true &&
          Object.entries(list).sort((a, b) => b[1] - a[1]).map(([key, value]) => (
            <div className="contentb">
                <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
            </div>))}
      </div>)}

}

function names(articleobjects, option, number, keyword, search){

  if (number == null){
    number = 5;
  }

  if (keyword == null){
    keyword = "";
  }
  
  if(!articleobjects){
      return(<></>)
  }
  
  
  function highest(obj) {
      // Extract keys and values from the object
      const entries = Object.entries(obj);
      
      // Sort entries by values in descending order
      entries.sort((a, b) => b[1] - a[1]);
      
      // Slice the first 5 entries to get the top 5 highest numbers
      const top = entries.slice(0, number);
      
      // Extract keys and values from the top 5 entries
       let result = [];
       top.forEach(([key, value]) => {
       result.push({name:key,
       count: value
       });
       });
      
      return result;
    }
  
  
  let list = {}
  articleobjects.forEach((item)=>{
      if(item.PER){
      item.PER.forEach((item)=>{
          const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/g;
          item = item.replace(specialCharsRegex, '')
          item = item.toUpperCase();
          if(list.hasOwnProperty(item)){
          list[item]++
          }
          else{if(item.toLowerCase().includes(keyword.toLowerCase())){list[item] = 1}}
      })}
  })


  


  let data = highest(list)


  if (option == 0){
          return(<>
            <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
            
          
            <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
            <ResponsiveContainer width="100%" height="100%" aspect={0}>
            <BarChart
              width={800}
              height={350}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 5
              }}
              style={{ position:'relative', right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#fc6d15" />
            </BarChart>
            </ResponsiveContainer>
            </div>
        
            </div>
            </>)}

    else{return(<div className="collapsible" id="statsref">
          <div className="headernop">
          <p>Mga Sasakyang Nabanggit</p>
          </div>
      
        {
          true &&
          Object.entries(list).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
            return key.toLowerCase().includes(search.toLowerCase())?
            <div className="contentb">
              <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
            </div>:""
            }
          )
        }

        </div>)}

function vehicles(articleobjects, option, number, keyword, search){

    if (number == null){
      number = 5;
    }
  
    if (keyword == null){
      keyword = "";
    }
    
    if(!articleobjects){
        return(<></>)
    }
    
    
    function highest(obj) {
        // Extract keys and values from the object
        const entries = Object.entries(obj);
        
        // Sort entries by values in descending order
        entries.sort((a, b) => b[1] - a[1]);
        
        // Slice the first 5 entries to get the top 5 highest numbers
        const top = entries.slice(0, number);
        
        // Extract keys and values from the top 5 entries
         let result = [];
         top.forEach(([key, value]) => {
         result.push({name:key,
         count: value
         });
         });
        
        return result;
      }
    
    
    let list = {}
    articleobjects.forEach((item)=>{
        if(item.VEH){
        item.PER.forEach((item)=>{
            if(list.hasOwnProperty(item)){
            list[item]++
            }
            else{if(item.toLowerCase().includes(keyword.toLowerCase())){list[item] = 1}}
        })}
    })
  
  
  
    let data = highest(list)
  
  
    if (option == 0){
            return(<>
              <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
              
            
              <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
              <ResponsiveContainer width="100%" height="100%" aspect={0}>
              <BarChart
                width={800}
                height={350}
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 5
                }}
                style={{ position:'relative', right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fc6d15" />
              </BarChart>
              </ResponsiveContainer>
              </div>
          
              </div>
              </>)}
  
      else{return(<div className="collapsible" id="statsref">
            <div className="headernop">
            <p>Mga Sasakyang Nabanggit</p>
            </div>
        
          {
            true &&
            Object.entries(list).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
              return key.toLowerCase().includes(search.toLowerCase())?
              <div className="contentb">
                <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
              </div>:""
              }
            )
          }
  
          </div>)}
  
  }

}

function vehicles(articleobjects, option, number, keyword, search){

  if (number == null){
    number = 5;
  }

  if (keyword == null){
    keyword = "";
  }
  
  if(!articleobjects){
      return(<></>)
  }
  
  
  function highest(obj) {
      // Extract keys and values from the object
      const entries = Object.entries(obj);
      
      // Sort entries by values in descending order
      entries.sort((a, b) => b[1] - a[1]);
      
      // Slice the first 5 entries to get the top 5 highest numbers
      const top = entries.slice(0, number);
      
      // Extract keys and values from the top 5 entries
       let result = [];
       top.forEach(([key, value]) => {
       result.push({name:key,
       count: value
       });
       });
      
      return result;
    }
  
  
  let list = {}
  articleobjects.forEach((item)=>{
    if(item.VEH){
    
    for (var loc in item.LOC){  
      if(item.LOC[loc].toLowerCase().includes(keyword.toLowerCase())){
        item.VEH.forEach((item)=>{

          const specialCharsRegex = /[`!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?~]/g;
          item = item.replace(specialCharsRegex, '')
          item = item.toUpperCase();
          if(list.hasOwnProperty(item)){
          list[item]++
          }
          else{list[item] = 1}
      })
      break;
      }
    }
    }
})



  let data = highest(list)


  if (option == 0){
          return(<>
            <div style={{ display: 'flex', height:'300px',width:'800px',justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
            
          
            <div style={{ display: 'flex', overflow: 'auto', height:'300px',width:'800px'}}>
            <ResponsiveContainer width="100%" height="100%" aspect={0}>
            <BarChart
              width={800}
              height={350}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 5
              }}
              style={{ position:'relative', right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#fc6d15" />
            </BarChart>
            </ResponsiveContainer>
            </div>
        
            </div>
            </>)}

    else{return(<div className="collapsible" id="statsref">
          <div className="headernop">
          <p>Mga Sasakyang Nabanggit</p>
          </div>
      
        {
          true &&
          Object.entries(list).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
            return key.toLowerCase().includes(search.toLowerCase())?
            <div className="contentb">
              <div className="contentbname">{key}</div><div className="contentbcount">{value}</div>
            </div>:""
            }
          )
        }

        </div>)}

}

export function Analysis(props) {
    
    const locationsref = useRef(null)
    const selectedref = useRef(null);
    const [search, changeSearch] = useState("");
    const [number, changeNumber] = useState(null);
    const [keyword, changeKeyword] = useState(null);
    const [activeIndex, changeIndex] = useState(null);
    const [selected, changeSelected] = useState(null);
    const [inj, changeInj] = useState("INJ");
    const [cause, changeCause] = useState("CAUSE");
    let stats = ["Dalas ng Lokasyon", "Pinsalang Natamo", "Madalas na Sanhi", "Tauhang Nabanggit", "Sasakyang Nabanggit"]

    function handleSelect(index){
        selectedref.current = stats[index];
        changeSelected(stats[index])
        changeIndex(index);
    }
    
    function numberInput(e) {
      const inputValue = e.target.value;
      // Regex to allow only numbers
      const regex = /^[0-9\b]+$/;
      if (inputValue === '' || regex.test(inputValue)) {
        changeNumber(inputValue);
      }
    };

    function keywordInput(e) {
      let inputValue = e.target.value;
      changeKeyword(inputValue);
    };
    

    function generatePDF() {
      const div1 = document.getElementById('statboxheader').firstElementChild;
      const div2 = document.getElementById('locationsref');
    

      const pdf = new jsPDF();
      let pageWidth = pdf.internal.pageSize.getWidth();
      let pageHeight = pdf.internal.pageSize.getHeight();

      // Add header text
      pdf.setFontSize(18);
      pdf.text('TalaTrapiko', 20, 20);
      let x = 20;
      let y = 170;
      html2canvas(div1).then(canvas => {
        const imgData1 = canvas.toDataURL('image/png');
        const imgWidth1 = canvas.width;
        const imgHeight1 = canvas.height;

        const scaleFactor1 = Math.min(pageWidth / imgWidth1, pageHeight / imgHeight1);
        const x1 = (pageWidth - imgWidth1 * scaleFactor1) / 2;
        const y1 = 40; // Adjust the position based on the header text height

        pdf.addImage(imgData1, 'PNG', x1, y1, imgWidth1 * scaleFactor1, imgHeight1 * scaleFactor1);

        html2canvas(div2).then(canvas => {
          const imgData2 = canvas.toDataURL('image/png');
          const imgWidth2 = canvas.width;
          const imgHeight2 = canvas.height;

          const scaleFactor2 = Math.min(pageWidth / imgWidth2, pageHeight / (imgHeight1 * scaleFactor1 + imgHeight2));
          const x2 = (pageWidth - imgWidth2 * scaleFactor2) / 2;
          const y2 = y1 + imgHeight1 * scaleFactor1 + 10;

          pdf.addImage(imgData2, 'PNG', x2, y2, imgWidth2 * scaleFactor2, imgHeight2 * scaleFactor2);

          const lineHeight = 5;
          const maxHeight = pdf.internal.pageSize.getHeight() - 20;

          pdf.setFontSize(18);
          
           pdf.text('Mga Lokasyong Nabanggit', x, y);
           y += 15;
           pdf.setFontSize(8);
          // Loop through the array and append each line of text
          props.articleobjects.forEach((item)=>{
            if(item.LOC){
            item.LOC.forEach(line => {
            const textHeight = pdf.getTextDimensions(line).h;
            if (y + textHeight > maxHeight) {
                // If the line will overflow, add a new page
                pdf.addPage();
                y = 10; // Reset the y coordinate for the new page
            }
            pdf.text(line, x, y);
            y += lineHeight; // Increment the y coordinate for the next line
          })}});
          // Clone the scrollable div and capture its full content
          
          pdf.save(`${(new Date()).toLocaleString()}_Locations`);
          
          
        });
      });
    }

    // pdf.save(`${(new Date()).toLocaleString()}_Locations`);
    
    return(<>
    <div id="stats">
    <div id="statscontainer">
    <p>Statistiko</p>
    {
    stats.map((item, index)=>(<div class={`stat ${index == activeIndex?'selectedarticle':'null'}`} onClick={() => {
    handleSelect(index); changeSearch(""); changeKeyword("")}}><span class="dot"></span>{item}</div>))}
    </div>
    </div>

    <div id="statbox">

    {!props.articleobjects?<div id="statboxb">Dito makikita ang mga pagsusuri</div>:selected?"":<div style={{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center",fontWeight:"bold",textDecorationLine: "underline",textDecorationColor: "#FFA500",fontSize:"32px"}}>Pumili ng statistiko na nais makita</div>}

    {activeIndex == 0 && props.articleobjects?(<>
    <div id="statboxheader">
      <h2>Mga Lokasyon na Madalas Banggitin</h2>
      <div id="filters">
        
        <labels><p>Ipakita ang top</p> 
        <input type="number" min="0" max="100" onChange={numberInput}/>
        </labels> 

        <labels><p>Filter ng Keyword</p>
        <input
         type="text"
         onChange={keywordInput}
        />
        </labels> 

        <labels>
        <div className="pdfbutton" onClick={generatePDF}>Generate PDF</div>
        </labels>

        </div>
    </div>{locations(props.articleobjects, 0, number, keyword)}</>):""}
    
    {activeIndex == 1 && props.articleobjects?(<>
    <div id="statboxheader">
      <h2>Mga Statistikong May Kaugnayan sa Pinsala</h2>

      <div id="filters">

      <labels><p>Pinsalang Nabanggit</p>
        <input
        name="By Gender"
        type="radio"
        checked={inj === "INJ"}
        onChange={() => {changeInj("INJ")}}
        />
      </labels>

      <labels><p>Pinsala ayon sa Kasarian</p>
        <input
        name="By Gender"
        type="radio"
        checked={inj === "GEND"}
        onChange={() => {changeInj("GEND")}}
        />
      </labels>

      <labels><p>Pinsala ayon sa Edad</p>
       <input
        name="By Age"
        type="radio"
        checked={inj === "AGE"}
        onChange={() => {changeInj("AGE")}}
       />
      </labels>

      </div>
    </div>{injuries(props.articleobjects, 0, inj)}</>):""}


    {activeIndex == 2 && props.articleobjects?(<>
    <div id="statboxheader">
      <h2>Mga Dahilan na Madalas Banggitin</h2>

      <div id="filters">

      <labels><p>Ipakita ang top</p> 
        <input type="number" min="0" max="100" onChange={numberInput}/>
      </labels> 

      <labels><p>Filter ng Keyword ayon sa Lokasyon</p>
        <input
         type="text"
         onChange={keywordInput}
        />
      </labels> 

      </div>
    </div>{causes(props.articleobjects, 0, cause, number, keyword)}</>):""}


    {activeIndex == 3 && props.articleobjects?(<>
    <div id="statboxheader">
      <h2>Mga Tauhan na Madalas Mabanggit</h2>
      <div id="filters">
        
        <labels><p>Ipakita ang top</p> 
        <input type="number" min="0" max="100" onChange={numberInput}/>
        </labels> 

        <labels><p>Filter ng Keyword</p>
        <input
         type="text"
         onChange={keywordInput}
        />
        </labels> 

        </div>
    </div>{names(props.articleobjects, 0, number, keyword)}</>):""}


    {activeIndex == 4 && props.articleobjects?(<>
    <div id="statboxheader">
      <h2>Mga Behikulo na Madalas Mabanggit</h2>
      <div id="filters">
        
        <labels><p>Ipakita ang top</p> 
        <input type="number" min="0" max="100" onChange={numberInput}/>
        </labels> 

        <labels><p>Filter ng Keyword ayon sa Lokasyon</p>
        <input
         type="text"
         onChange={keywordInput}
        />
        </labels> 

        </div>
    </div>{vehicles(props.articleobjects, 0, number, keyword)}</>):""}

    
    </div>


    <div id="statnames">

    {!props.articleobjects?<div id="statboxb">Statistics will show up here</div>:""}

    {activeIndex == 0 && props.articleobjects?<>
            <div id="searchbarcontainer">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type='text' placeholder="Search" id="searchbar" onChange={(e) => { changeSearch(e.target.value); }}></input>
            </div>
            {locations(props.articleobjects, 1, 0, null, search)}
            </>:""}
    
    {activeIndex == 1 && props.articleobjects?injuries(props.articleobjects, 1):""}
    
    {activeIndex == 2 && props.articleobjects?causes(props.articleobjects, 1):""}

    {activeIndex == 3 && props.articleobjects?<>
            <div id="searchbarcontainer">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type='text' placeholder="Search" id="searchbar" onChange={(e) => { changeSearch(e.target.value); }}></input>
            </div>
            {names(props.articleobjects, 1, 0, null, search)}
            </>:""}

      {activeIndex == 4 && props.articleobjects?<>
            <div id="searchbarcontainer">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type='text' placeholder="Search" id="searchbar" onChange={(e) => { changeSearch(e.target.value); }}></input>
            </div>
            {vehicles(props.articleobjects, 1, 0, null, search)}
            </>:""}
    

    </div>

    </>)

}
