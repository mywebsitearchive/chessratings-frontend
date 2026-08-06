import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import { /* Backdrop, CircularProgress, */ FormControl, InputLabel, MenuItem, Select, /* Table, TableBody, TableCell, TableHead, TableRow, */ TextField} from '@mui/material';

interface UserData{
  name : string,
  data: any[],
  variant: number
}

/* interface ApiData{
  haut : any[],
  haettu : boolean
} */

function App() {
  const [u1, setU1] = useState<string>("");
  const [u2, setU2] = useState<string>("");
  const [variant, setVariant] = useState<string>("");
  const [variant2, setVariant2] = useState<string>("");
  const [dataPisteet, setDataPisteet] = useState<any>([]);
  const [dataPisteet2, setDataPisteet2] = useState<any>([]);
  const [xLabels, setXLabels] = useState<any>([])
  const [aikavali, setAikavali] = useState<any>([])
/*   const [apiData, setApiData]= useState<ApiData>({
    haut: [{}],
    haettu: true,
  }) */
/*   const nowUnix = new Date().getTime();
  const nowDay = new Date().getDay();
  const nowYear = new Date().getFullYear();
  const msDay = 86400000; */

  const [haettu, setHaettu] = useState<number>(0);
  const [haettu2, setHaettu2] = useState<number>(0);
  const [vertailu, setVertailu] = useState<boolean>(false);
/*   const [aikajarjestys, setAikajarjestys] = useState<boolean>(false); */
  const [styles, setStyles] = useState<any>([
    "background-color : rgb(67, 67, 67) !important",
    "background-color : rgb(31, 31, 31) !important",
    "background-color : rgb(31, 31, 31) !important",
  ])
  const margin = { right: 24 };
  const [nakyma, setNakyma] = useState<number>(0);
  const [u1Data, setU1Data] = useState<UserData>({name: "", data: [], variant:-1})
  const [u2Data, setU2Data] = useState<UserData>({name: "", data: [], variant:-1})
  const color : string = '#ff0000'
  const connectNulls : boolean = true;

  const createList=(points:any)=>{
    if(points.length > 0){
        let now = new Date()
        let currentMonth = (now.getFullYear()-2010)*12 + now.getMonth()
        let ratingArray = [];
        for(let i = 0; i < points.length; i++){
            let timestamp = (points[i][0]-2010)*12+points[i][1]
            let rating = points[i][3];
            if(ratingArray[timestamp] == undefined || ratingArray[timestamp] < rating){
                ratingArray[timestamp] = rating
            }
        }
        for(let i = 0; i < currentMonth; i++){
            if(ratingArray[i] == undefined){
                ratingArray[i] = null
            }
        }
        return ratingArray;
    }
    return [];
}
  const findVariant=(data:any)=>{
      let variants = []
      for(let i = 0; i < 14; i++){
          variants[i] = data[i].points.length
      }
      return variants.indexOf(Math.max(...variants))
  }
  const vaihdaNakyma=(nakyma : number)=>{
    if(nakyma == 1){
      if(typeof u1Data.data != "undefined" && JSON.stringify(u1Data.data) != "[]"){
        if((String(u2Data.data)).length > 0 && typeof String(u2Data.data) != "undefined"){
          let firstValue = u1Data.data.findIndex((x:any)=> x != null)
          let firstValue2 = u2Data.data.findIndex((x:any)=> x != null)
    
          let lastValue = u1Data.data.findLastIndex((x:any)=> x != null)
          let lastValue2 = u2Data.data.findLastIndex((x:any)=> x != null)
    
          setDataPisteet(u1Data.data.slice(Math.min(firstValue, firstValue2), Math.max(lastValue, lastValue2)+1))
          setDataPisteet2(u2Data.data.slice(Math.min(firstValue, firstValue2), Math.max(lastValue, lastValue2)+1))
          
          setAikavali([Math.min(firstValue, firstValue2), Math.max(lastValue, lastValue2)+1])
        }
        else{
          let firstValue = u1Data.data.findIndex((x:any)=> x != null)
          let lastValue = u1Data.data.findLastIndex((x:any)=> x != null)
    
          setDataPisteet(u1Data.data.slice(firstValue, lastValue+1))
    
          setAikavali([firstValue, lastValue+1])
        }
      setNakyma(1)
      }
    else{
      alert("käyttäjää ei löydy")
    }}
    if(nakyma == 0){
      setU1("")
      setU2("")
      setU1Data({name: "", data: [], variant:-1})
      setU2Data({name: "", data: [], variant:-1})
      setNakyma(0)
    }
    if(nakyma == 2){
      setHaettu2(haettu2+1)
      setNakyma(2)
    }
  }
  const luoOtsikot=async()=>{
    let nyt = new Date();
    let kuukausiNumero = 0;
    let arr = []
    for(let vuosi = 2010; vuosi <= nyt.getFullYear(); vuosi++){
      for(let kuukausi = 1; kuukausi < 13; kuukausi++){
        arr[kuukausiNumero] = `${kuukausi}/${vuosi}`
        kuukausiNumero++
      }
    }
    setXLabels(arr.slice(aikavali[0], aikavali[1]))
  }
  const apiKutsu=async(nimi : string, variant : string)=>{
    if(nimi.length > 0){
      const yhteys = await fetch(`https://lichess.org/api/user/${nimi}/rating-history`, {method : "GET"});
      try{
        if(yhteys.status === 200){
          let variantNumber : number;
          switch (variant) {
              case ("UltraBullet"):	
                  variantNumber= 0; break;
              case ("Bullet"):	
                  variantNumber= 1; break;
              case ("Blitz"):	
                  variantNumber= 2; break;
              case ("Rapid"):	
                  variantNumber= 3; break;
              case ("Classical"):	
                  variantNumber= 4; break;
              case ("Correspondence"):	
                  variantNumber= 5; break;
              case ("Crazyhouse"):	
                  variantNumber= 6; break;
              case ("Chess960"):	
                  variantNumber= 7; break;
              case ("King of the Hill"):	
                  variantNumber= 8; break;
              case ("Three-check"):	
                  variantNumber= 9; break;
              case ("Antichess"):	
                  variantNumber= 10; break;
              case ("Atomic"):	
                  variantNumber= 11; break;
              case ("Horde"):	
                  variantNumber= 12; break;
              case ("Racing Kings"):	
                  variantNumber= 13; break;
              case ("Puzzles"):	
                  variantNumber= 14; break;
              default:	
                  variantNumber= -1; break;
          }
          if(variantNumber == -1){
              let fullData : any = await yhteys.json();
              let list = createList((fullData)[findVariant(fullData)].points)
              let variantNum : number = findVariant(fullData)
              return {name:nimi, data:list, variant:variantNum}
          }
          else{
              let data = createList((await yhteys.json())[variantNumber].points)
              return {name:nimi, data:data, variant:variantNumber}
          }
        }
        else {
          alert("Virhe:" + yhteys.status)
        }}
      catch(e:any){
        alert("Odottamaton virhe.")
      }
    }
    return {name:nimi, data:[], variant:-1}
  }
  const haeTiedot=async()=>{
    setU1Data(await apiKutsu(u1, variant))
    setU2Data(await apiKutsu(u2, variant2))
    setHaettu(haettu+1)
  }
  const haeVariantti=(x : number)=>{
      let variant : string = ""
      switch(x){
        case (0):	
          variant = 'UltraBullet'; break;
        case (1):	
          variant = 'Bullet'; break;
        case (2):	
          variant = 'Blitz'; break;
        case (3):	
          variant = 'Rapid'; break;
        case (4):	
          variant = 'Classical'; break;
        case (5):	
          variant = 'Correspondence'; break;
        case (6):	
          variant = 'Crazyhouse'; break;
        case (7):	
          variant = 'Chess960'; break;
        case (8):	
          variant = 'King of the Hill'; break;
        case (9):	
          variant = 'Three-check'; break;
        case (10):	
          variant = 'Antichess'; break;
        case (11):	
          variant = 'Atomic'; break;
        case (12):	
          variant = 'Horde'; break;
        case (13):	
          variant = 'Racing Kings'; break;
        case (14):	
          variant = 'Puzzles'; break;
      }
      return variant
    }
  const suurinArvo=(array:any[])=>{
    if(array.length > 0){
      let newArr = []
      for(let i = 0; i < array.length; i++){
            if(Number(array[i]) > 0){
                  newArr.push(array[i])
            }
      }
      return Math.max(...newArr);
    }
    else{
      return 0;
    }
  }
  const pieninArvo=(array:any[])=>{
        let newArr = []
        for(let i = 0; i < array.length; i++){
              if(Number(array[i]) > 0){
                    newArr.push(array[i])
              }
        }
        return Math.min(...newArr);
    }
  const laskeArvot=(array:any[])=>{
      let newArr = []
      for(let i = 0; i < array.length; i++){
            if(Number(array[i]) > 0){
                  newArr.push(array[i])
            }
      }
      return newArr.length;
  }
/*   const paivitaHistoria=async()=>{
    try{
      if(u1Data.data.length > 0){
        await fetch("http://localhost:3000/api/history", {
           method: "POST",
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
              aikaleima:new Date().getTime()/1000,
              nimi1:u1,
              variant1:u1Data.variant,
              maxRating1:suurinArvo(u1Data.data),
              nimi2:u2,
              variant2:u2Data.variant,
              maxRating2:suurinArvo(u2Data.data),
           })
       });
      }
    }catch(e:any){
    throw new Error
  }} *//* 
  const haeHistoria=async()=>{
    setApiData({
      ...apiData,
      haettu : false,
    })
    try{
       const yhteys = await fetch("http://localhost:3000/api/history", {method: "GET"});
          setApiData({
            ...apiData,
            haut : await yhteys.json(),
            haettu : true
          })
    }catch(e:any){
    throw new Error
  }
  } *//* 
  const poistaRivi=async(x:number)=>{
    setHaettu2(haettu2+1)
    try{
        await fetch(`http://localhost:3000/api/history/${x}` , {
           method: "DELETE",
           headers: {
               'Content-Type': 'application/json'
           },
          });
    }catch(e:any){
    throw new Error
  }
  } */
/*   const suodata=(a : any, b : any)=>{
    if(aikajarjestys){
      return b.aikaleima - a.aikaleima
    }
    else{
      return Math.max(b.maxRating1, b.maxRating2) - Math.max(a.maxRating1, a.maxRating2)
    }
  } */
  useEffect(()=>{
    luoOtsikot();
    let styles2 = [
      "background-color : rgb(31, 31, 31) !important",
      "background-color : rgb(31, 31, 31) !important",
      "background-color : rgb(31, 31, 31) !important",
    ]
    styles2[nakyma] = "background-color : rgb(67, 67, 67) !important"
    setStyles(styles2)
  }, [nakyma]);

  useEffect(()=>{
    if(u1.length > 0){vaihdaNakyma(1)}
  }, [haettu])

  return (
    <>
    <Container id='navi'>
      <Button onClick={()=>vaihdaNakyma(0)} sx={styles[0]} className='navibtn'>Haku</Button>
      <Button onClick={()=>vaihdaNakyma(1)} sx={styles[1]} className='navibtn'>Taulukko</Button>
      {/* <Button onClick={()=>vaihdaNakyma(2)} sx={styles[2]} className='navibtn'>Historia</Button> */}
    </Container>
    {nakyma == 0 &&
      <Container className='big-box'>
        <Container className="rivi">
          <TextField
            label="Käyttäjänimi"
            variant='filled'
            className='tekstikentta'
            sx={{backgroundColor:"white",  marginRight:"40px"}}
            onChange={(event)=>setU1(String(event.target.value))}
            />
          {vertailu &&
            <TextField
              label="Käyttäjänimi"
              variant='filled'
              className='tekstikentta'
              sx={{backgroundColor:"white"}}
              onChange={(event)=>setU2(String(event.target.value))}
              />
          }
            {!vertailu &&
            <Button
              sx={{marginLeft:"40px", marginRight:"40px", height:"56px"}}
              onClick={()=>{setVertailu(!vertailu)}}
            >
              Vertaa pelaajia
          </Button>
            }
        </Container>
        <Container className="rivi">
          <FormControl variant="filled" sx={{backgroundColor:"white", width:"217px"}} > 
            <InputLabel>Variant</InputLabel>
            <Select
              onChange={(event:any)=>{setVariant(String(event.target.value))}}
              value={variant}
            >
              <MenuItem value={''}>Valitse</MenuItem>
              <MenuItem value={'UltraBullet'}>UltraBullet</MenuItem>
              <MenuItem value={'Bullet'}>Bullet</MenuItem>
              <MenuItem value={'Blitz'}>Blitz</MenuItem>
              <MenuItem value={'Rapid'}>Rapid</MenuItem>
              <MenuItem value={'Classical'}>Classical</MenuItem>
              <MenuItem value={'Correspondence'}>Correspondence</MenuItem>
              <MenuItem value={'Crazyhouse'}>Crazyhouse</MenuItem>
              <MenuItem value={'Chess960'}>Chess960</MenuItem>
              <MenuItem value={'King of the Hill'}>King of the Hill</MenuItem>
              <MenuItem value={'Three-check'}>Three-check</MenuItem>
              <MenuItem value={'Antichess'}>Antichess</MenuItem>
              <MenuItem value={'Atomic'}>Atomic</MenuItem>
              <MenuItem value={'Horde'}>Horde</MenuItem>
              <MenuItem value={'Racing Kings'}>Racing Kings</MenuItem>
              <MenuItem value={'Puzzles'}>Puzzles</MenuItem>

            </Select>
          </FormControl>
      {vertailu &&
            <FormControl variant="filled" sx={{backgroundColor:"white", width:"217px", marginLeft:"40px"}} > 
              <InputLabel>Variant</InputLabel>
              <Select
                onChange={(event:any)=>{setVariant2(String(event.target.value))}}
              >
                <MenuItem value={'UltraBullet'}>UltraBullet</MenuItem>
                <MenuItem value={'Bullet'}>Bullet</MenuItem>
                <MenuItem value={'Blitz'}>Blitz</MenuItem>
                <MenuItem value={'Rapid'}>Rapid</MenuItem>
                <MenuItem value={'Classical'}>Classical</MenuItem>
                <MenuItem value={'Correspondence'}>Correspondence</MenuItem>
                <MenuItem value={'Crazyhouse'}>Crazyhouse</MenuItem>
                <MenuItem value={'Chess960'}>Chess960</MenuItem>
                <MenuItem value={'King of the Hill'}>King of the Hill</MenuItem>
                <MenuItem value={'Three-check'}>Three-check</MenuItem>
                <MenuItem value={'Antichess'}>Antichess</MenuItem>
                <MenuItem value={'Atomic'}>Atomic</MenuItem>
                <MenuItem value={'Horde'}>Horde</MenuItem>
                <MenuItem value={'Racing Kings'}>Racing Kings</MenuItem>
                <MenuItem value={'Puzzles'}>Puzzles</MenuItem>
              </Select>
            </FormControl>
            }
          </Container>
          <Container className="rivi">
            <Button onClick={()=>{haeTiedot()}}>Hae</Button>
          </Container>
        </Container>
      }
    {nakyma == 1 &&
        <Container className='big-box'>
            <Container
              className='chart'
            >
              <Box sx={{ width: '100%', height: 300}}>
                    <LineChart
                      series={[
                        { data: dataPisteet, label: `${u1} - ${haeVariantti(u1Data.variant)}`, connectNulls, showMark:laskeArvot(u1Data.data) == 1},
                        { data: dataPisteet2, label: `${u2} - ${haeVariantti(u2Data.variant)}`, connectNulls, color, showMark:laskeArvot(u2Data.data) == 1},
                      ]}
                      yAxis={[{ 
                        min: -100+Number(Math.min(pieninArvo(u1Data.data), pieninArvo(u2Data.data))),
                        max: 100+Number(Math.max(suurinArvo(u1Data.data), suurinArvo(u2Data.data)))
                      }]}
                      xAxis={[{ scaleType: 'point', data:  xLabels }]}
                      margin={margin}
                      grid={{horizontal: true }}
                    />
                  </Box>
            </Container>
        </Container>
    }
    {nakyma == 2  &&
      <Container className='big-box' sx={{overflow:"scroll"}}>

{/*          <Button onClick={()=>{setAikajarjestys(!aikajarjestys)}}>
          {aikajarjestys ? <>Suodata ELO:n mukaan</>:<>Suodata hakuajan mukaan</>}
         </Button>
         {!apiData.haettu && <Backdrop open><CircularProgress sx={{scale:"3"}}/></Backdrop>}
        <Table className='taulukko'>
          <TableHead>
            <TableRow sx={{backgroundColor:"rgb(181, 181, 181)"}}>
              <TableCell sx={{fontSize:"20px"}}>Nimi</TableCell>
              <TableCell sx={{fontSize:"20px"}}>Variantti</TableCell>
              <TableCell sx={{fontSize:"20px"}}>Korkein ELO</TableCell>
              <TableCell></TableCell>
              <TableCell sx={{fontSize:"20px"}}>Nimi</TableCell>
              <TableCell sx={{fontSize:"20px"}}>Variantti</TableCell>
              <TableCell sx={{fontSize:"20px"}}>Korkein ELO</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {apiData.haut.sort(suodata).map((haku : any)=>{
                if(haku.nimi1 != ""){
                  return(
                    <>
                      <TableRow>
                        <TableCell>{haku.nimi1}</TableCell>
                        <TableCell>{haeVariantti(haku.variant1)}</TableCell>
                        <TableCell>{haku.maxRating1}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{haku.nimi2}</TableCell>
                        <TableCell>{haeVariantti(haku.variant2)}</TableCell>
                        <TableCell>
                          {haku.maxRating2 > 0 &&
                          <>{haku.maxRating2}</>
                          }

                        </TableCell>
                        <TableCell>
                          {(nowUnix/msDay-new Date(haku.aikaleima*1000).getTime()/msDay < 1)&&(nowDay == new Date(haku.aikaleima*1000).getDay()) ?
                          <>Tänään</>
                          :
                          <>
                          {new Date(haku.aikaleima*1000).getDate()}.{new Date(haku.aikaleima*1000).getMonth()+1}.
                          {nowYear != new Date(haku.aikaleima*1000).getFullYear()&&
                            <>
                              {new Date(haku.aikaleima*1000).getFullYear()}
                            </>
                          }
                          </>
                          }
                          {` klo ${new Date(haku.aikaleima*1000).getHours()}.${String(new Date(haku.aikaleima*1000).getMinutes()).padStart(2, "0")}`}
                          </TableCell>
                        <TableCell>
                          <Button onClick={()=>{poistaRivi(haku.id)}} className='tablebtn'>
                            Poista
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                }
              })}
          </TableBody>
        </Table> */}
        
      </Container>
    }

      
    </>
  ) 
}

export default App
