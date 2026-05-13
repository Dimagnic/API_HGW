/// <reference path="../pb_data/types.d.ts" />
onRecordsListRequest((e) => {
  e.next();
}, "api_logs");

onRecordCreateRequest((e) => {
  e.next();
}, "api_logs");

onRecordUpdateRequest((e) => {
  e.next();
}, "api_logs");

onRecordDeleteRequest((e) => {
  e.next();
}, "api_logs");