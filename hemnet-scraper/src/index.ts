import  DataExtractor  from "./DataExtractor";

const tallkrogenSoldUrl: string = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=";
const dataExtractor: DataExtractor = new DataExtractor(tallkrogenSoldUrl);


await dataExtractor.start();

// (async () =>  {

//     const salesData: { address: string; soldDate: any; livingArea: any; extraArea: any; land: any; rooms: any; houseType: any; assignment: any; askingPrice: any; soldPrice: any; }[] = [],
//       tallkrogenSoldUrl = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=";

//     const getNumberOfPages = async () => {

//         const {data: websiteData}  = await axios.get(tallkrogenSoldUrl + 1),
//             $ = cheerio.load(websiteData),
//             lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');

//         return lastPage;

//     };

//     const findTag = (prop) => {

        


//     }

//     const writeFile = (data: { address: string; soldDate: any; livingArea: any; extraArea: any; land: any; rooms: any; houseType: any; assignment: any; askingPrice: any; soldPrice: any; }[], filePath = "../data/salesData.json") => {

//         try {
            
//             fs.writeFileSync(filePath, JSON.stringify(data));
            
//         } catch(error) {

//             console.log(error);

//         }

//     };



//     Array.from({length: await getNumberOfPages()}, (_, i) => i + 1).forEach( async (pageNumber) => {

//         const {data: websiteData}  = await axios.get(`${tallkrogenSoldUrl}${pageNumber}`),
//                 $ = cheerio.load(websiteData),
//                 property = $("li.sold-results__normal-hit"),
//                 propertyLink = $("li.sold-results__normal-hit a");

//         property.each(async (idx, el) => {
        
//             const $ = cheerio.load(el); 


            
//             const {data: propertyData}  = await axios.get($("a").attr('href')),
//                                      $$ = cheerio.load(propertyData);


//             soldPrice = $$("span.sold-property__price-value")
//                         .text()
//                         .replace("kr", "")
//                         .replace(/\s+/g, '');
//             askingPrice = $$("dd.sold-property__attribute-value")
//                         .eq(1)
//                         .text()
//                         .replace("kr", "")
//                         .replace(/\s+/g, '');
//             houseType = $$("dd.sold-property__attribute-value")
//                         .eq(3)
//                         .text()
//                         .replace(/\s+/g, '');
//             assignment = $$("dd.sold-property__attribute-value")
//                         .eq(4)
//                         .text()
//                         .replace(/\s+/g, '');
//             rooms = $$("dd.sold-property__attribute-value")
//                         .eq(5)
//                         .text()
//                         .replace('rum',"")
//                         .replace(/\s+/g, '');
//             livingArea = $$("dd.sold-property__attribute-value")
//                         .eq(6)
//                         .text()
//                         .replace("m²", '')
//                         .replace(/\s+/g, '');
//             extraArea = $$("dd.sold-property__attribute-value")
//                         .eq(7)
//                         .text()
//                         .replace("m²", '')
//                         .replace(/\s+/g, '');
//             land = $$("dd.sold-property__attribute-value")
//                     .eq(8)
//                     .text()
//                     .replace("m²", '')
//                     .replace(/\s+/g, '');
//             address =  $$("h1.hcl-heading--size1")
//                         .text()
//                         .replace("Slutpris", "")
//                         .replace(/\s+/g, '')
//                         .split(/(\d+)/);
//             soldDate = $$(".qa-sold-property-metadata time").attr('datetime');

//             salesData.push({
//                 address: `${address[0]} ${address[1]}`,
//                 soldDate,
//                 livingArea,
//                 extraArea,
//                 land,
//                 rooms,
//                 extraArea,
//                 houseType,
//                 assignment,
//                 askingPrice,
//                 soldPrice,
//             });

//             writeFile(salesData)

            
//         });

            
//     });


// })()
