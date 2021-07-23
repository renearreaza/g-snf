import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';
import { GraphRequestOptions, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}

export async function getSharePointData(accessToken: string){
    const client = getAuthenticatedClient(accessToken);
    let response = await client.api('/sites/sjrb.sharepoint.com,4d8070f6-b5e9-4edf-a412-7f013e1bc143,abd42384-afca-4275-9e68-71dccd0e08ed/lists/6ef91b3c-48f0-4935-81be-f49355b9fc96/items?expand=fields(select=Id,Status,Requester,Approver)')
	  .top(2)
    .get();

    var SPids = [];
    
    for (let index = 0; index < response.value.length; index++) {
      const element = response.value[index].fields;

      var SP_record = {ID: null, Status: null, Requester: null, Approver: null}
      SP_record["ID"] = element.id;
      SP_record["Status"] = element.Status;
      SP_record["Approver"] = element.Approver;
      SP_record["Requester"] = element.Requester;
      SPids.push(SP_record);
    }
    return SPids
}

export async function getSharePointDataSubscriptions(accessToken: string){

  const client = getAuthenticatedClient(accessToken);
  const user = await client
    .api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  var userEmail = user.mail;

  var APIreq = `/sites/sjrb.sharepoint.com,4d8070f6-b5e9-4edf-a412-7f013e1bc143,abd42384-afca-4275-9e68-71dccd0e08ed/lists/059529bc-d008-4f66-9f5b-5a4e5242741c/items?$filter=fields/Title eq '${userEmail}'`

  let response = await client
  .api(APIreq)
  .header("Prefer", "HonorNonIndexedQueriesWarningMayFailRandomly")
  .expand("fields")
  .top(2)
  .get();

  console.log(response);

  var SubContentIDs = [];

  for (let index = 0; index < response.value.length; index++) {
    const element = response.value[index].fields;
    SubContentIDs.push(element.SubContentTypeID)
  }

  console.log(SubContentIDs)

  let articles = await getSubscribedNewsArticles(accessToken)

  var SPids = [];

  for (let index = 0; index < articles.value.length; index++) {
    const element = articles.value[index].fields;    
    if(SubContentIDs.includes(element.ContentTypeID0))
    {
      var SP_record = {Title: null, ContentDesc: null, ContentTypeID: null}
      console.log(element.ContentTypeID0)
      SP_record["Title"] = element.Title;
      SP_record["ContentDesc"] = element.ContentDesc;
      SP_record["ContentTypeID"] = element.ContentTypeID0;
      SPids.push(SP_record);
    }
    
  }

  console.log(SPids)
  return SPids
}

async function getSubscribedNewsArticles(accessToken: string)
{
  const client = getAuthenticatedClient(accessToken);
  var endDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let response = await client
  .api(`sites/sjrb.sharepoint.com,4d8070f6-b5e9-4edf-a412-7f013e1bc143,abd42384-afca-4275-9e68-71dccd0e08ed/lists/7d261f77-64f3-4f66-acdf-e5a7c8089da8/items?$filter=fields/CreationDate ge '${endDate}' `)
  .header("Prefer", "HonorNonIndexedQueriesWarningMayFailRandomly")
  .expand("fields")
  .get();
  
  console.log(response);

  return response;
}


export async function getUserWeekCalendar(accessToken: string, timeZone: string, startDate: Moment): Promise<Event[]> {
    const client = getAuthenticatedClient(accessToken);
    var startDateTime = startDate.format();
    var endDateTime = moment(startDate).add(7, 'day').format();


    console.log(startDateTime);
    console.log(endDateTime);
    // GET /me/calendarview?startDateTime=''&endDateTime=''
    // &$select=subject,organizer,start,end
    // &$orderby=start/dateTime
    // &$top=50
    var response: PageCollection = await client
      .api('/me/calendarview')
      .header('Prefer', `outlook.timezone="${timeZone}"`)
      .query({ startDateTime: startDateTime, endDateTime: endDateTime })
      .select('subject,organizer,start,end')
      .orderby('start/dateTime')
      .top(25)
      .get();
  
    if (response["@odata.nextLink"]) {
      // Presence of the nextLink property indicates more results are available
      // Use a page iterator to get all results
      var events: Event[] = [];
  
      // Must include the time zone header in page
      // requests too
      var options: GraphRequestOptions = {
        headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
      };
  
      var pageIterator = new PageIterator(client, response, (event) => {
        events.push(event);
        return true;
      }, options);
  
      await pageIterator.iterate();
  
      return events;
    } else {
  
      return response.value;
    }
  }