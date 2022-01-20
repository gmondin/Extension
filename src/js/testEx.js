//*** extension to read a table on the the page e based on a specific field call a service api and create a popover with this information and a button *//
//********************************** MAIN FUNCTION **************************************//
var ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => { 
  /* Do things after DOM has fully loaded */ 
	var documentHtml = document.body.innerHTML;

	try
	{
		let arrayConcatIdName = readTable();
		let strConcatIdName = '';
		if (arrayConcatIdName.length > 0){
			for (i = 0; i < arrayConcatIdName.length; i++){
				if (arrayConcatIdName[i]['name'] == arrayConcatIdName[i]['idName'])
					strConcatIdName = strConcatIdName + arrayConcatIdName[i]['name'] + ';';
			}
			getJson(strConcatIdName, arrayConcatIdName);
		}
	} catch(err) { 
		document.body.innerHTML = documentHtml;
		console.log(err);
	}
});

//********************************** END MAIN FUNCTION ***********************************//

//********************************** CREATE POPOVER ***************************************//

//********************************** AUX FUNCTION POPOVER ******************************//
		
function readTable()
{	
	var info = [];
	var trsDataView = document.querySelector('#dataView');
	var trsHead = trsDataView.querySelectorAll('thead>tr');
	var trsBody = trsDataView.querySelectorAll('tbody>tr');	

	if (trsHead)
	{		
		let indexField1 = -1;
		for (var k = 0, row; row = trsHead[k]; k++) {
			for (var j = 0, col; col = row.cells[j]; j++) {
				if (col.innerText.toUpperCase() == 'FIELD1')
					indexField1 = j;
			}
		}
		
		for (var k = 0, row; row = trsBody[k]; k++) {
			for (var j = 0, col; col = row.cells[j]; j++) {
				if (j == indexField1)
				{
					let name = col.innerHTML;
					if (name != '')
					{
						let idName = name;
						if (info.length > 0){
							let info = '';
							let counter = 0;
							let check = false;
							
							do{
						
								check = false;									
								info =  info.filter(
												function(info) {
												return info.idName == idName;
												}
											);	
									
								if (infoTag.length > 0){
									idName = name + counter.toString();
									counter += 1;
									check = true;
								}									
																	
							}while(check)
						}
						col.innerHTML = createLinkPopover(idName, name);
						
						
							
						tagInfo.push({idName: idName, name: name});	
					}
				}
				
			}
		}
	}	
	
	return tagInfo;
}


//Get information from json
function getJson(dataInfoJson, arrDataInfo)
{
	/*let api_url = 'https://restcountries.eu/rest/v2/alpha?codes=' + dataInfoJson;
	$.ajax({
		url: api_url,
		dataType: 'json',
		method : 'GET',
		success: function(data){				
			for (i=0; i < arrDataInfo.length; i++){
				let infoObject =  data.filter(
								function(data) {
									if (data != undefined && data != null)
										return data.alpha3Code == arrDataInfo[i].name;											
								}
							);
							
				let testo = '<h3> Non trovato</h3>'; 
				let name = arrDataInfo[i].name;
				
				if (infoObject.length > 0){
					testo = '<h3>' + infoObject[0].name + '</h3><p>Capital: ' + infoObject[0].capital + '</br>Region: ' + infoObject[0].region + '</br>Sub Region: ' + infoObject[0].subregion + '</p>'; 
					name = infoObject[0].name;							
				}

				creatPopover(arrDataInfo[i].idName, createContentPopover(testo, arrDataInfo[i].idName), createTitlePopover(name), 'botton');						
			}	
		}					
	});	*/		

	for (i=0; i < arrDataInfo.length; i++){
		let testo = '<h3>' + arrDataInfo[i].name + '</h3>'; 
		creatPopover(arrDataInfo[i].idName, createContentPopover(testo, arrDataInfo[i].name), createTitlePopover(arrDataInfo[i].name), 'bottom');						
	}	
}

//********************************** END AUX FUNCTION POPOVER **************************//

//create the html content
function createContentPopover(text, name)
{
	return '<div class="popoverTest-content"><div> Information: ' + testo + '</div><div style="text-align: right;"><button type="button" class="btnPopoverTest btnPopoverTest-default" onclick="window.open(\'' + link + '\')">Go</button></div></div>';
}

//create the title the popover
function createTitlePopover(info)
{
	return '<h3 class="popoverTest-title">' + info + '</h3>';
}

//create html linke to call the popover
function createLinkPopover(name, testo)
{
	return '<a href="#" id="idTag' + name + '" data-container="body" data-content="" data-placement="bottom">' + testo + '</a>' ;
}

//Create window with the information
function creatPopover(name, contentText, titleText, position){
	var nameTag = '#idTag' + name;
	
	var elem = document.querySelector(nameTag);

	const ttBox = document.createElement('div');
	ttBox.id = 'tt' + name;
	ttBox.style.visibility = "hidden";
	ttBox.style.position = "fixed";
	ttBox.style.top = "0.5rem";
	ttBox.style.left = "0.5rem";
	ttBox.style.width = "20rem";
	ttBox.style.borderRadius = "1rem";
	ttBox.style.border = "solid thin lightblue";
	ttBox.style.backgroundColor = "white";	
	ttBox.classList.add('popoverTest')

	document.body.appendChild(ttBox);
	
	const ttTurnOn = ((evt) => {
		
		var listElem = document.querySelectorAll('.popoverTest');
	
		for (i = 0; i < listElem.length; i++)
		{
			listElem[i].style.visibility = 'hidden';
		}

		const boundBox = evt.target.getBoundingClientRect();
		const coordX = boundBox.left;
		const coordY = boundBox.top;

		ttBox.style.left = (coordX + 5).toString() + "px";
		ttBox.style.top = (coordY + 15).toString() + "px";
	
		ttBox.innerHTML = titleText + contentText;

		ttBox.style.visibility = "visible";
	});
	
	const ttTurnOnDiv = ((evt) => {
		
		var listElem = document.querySelectorAll('.popoverTest');
	
		for (i = 0; i < listElem.length; i++)
		{
			listElem[i].style.visibility = 'hidden';
		}
		ttBox.style.visibility = "visible";
	});
	
	const ttTurnOff = (() => {
		//setTimeout(200);
		var listElem = document.querySelectorAll('.popoverTest');
	
		for (i = 0; i < listElem.length; i++)
		{
			listElem[i].style.visibility = 'hidden';
		}
		
	});
	
	elem.addEventListener("mouseover", ttTurnOn , false);
	ttBox.addEventListener("mouseover", ttTurnOnDiv , false);
	ttBox.addEventListener("mouseout", ttTurnOff , false);
	document.getElementById("tt" + name).addEventListener("click", ttTurnOff , false);	
}


//********************************** END CREATE POPOVER ************************************//

