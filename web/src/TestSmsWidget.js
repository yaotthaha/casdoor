// Copyright 2023 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Setting from "./Setting";
import i18next from "i18next";

export function sendTestSms(provider, phone) {
  testSmsProvider(provider, phone)
    .then((res) => {
      if (res.status === "ok") {
        Setting.showMessage("success", `${i18next.t("provider:SMS sent successfully")}`);
      } else {
        Setting.showMessage("error", res.msg);
      }
    })
    .catch(error => {
      Setting.showMessage("error", `${i18next.t("general:Failed to connect to server")}: ${error}`);
    });
}

function testSmsProvider(provider, phone = "") {
  const SmsForm = {
    content: "123456",
    receivers: [phone],
  };

  return fetch(`${Setting.ServerUrl}/api/send-sms?provider=` + provider.name, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(SmsForm),
  }).then(res => res.json());
}
