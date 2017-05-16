# cloudenabler-test-command
Shell commands to generate test environment quickly (by CloudEnabler API)


# Installation
 - Ubuntu platform with Node.js 7.x (needs async/await)
 - `git clone` this project
 - `npm install` install the required modules
 - Modify `CLOUD_URL` in `config.js`, it has to be the URL link of your cloud-enabler server.
 - Modify the settings of the API script that you want to test. e.g. bin/new_register.js
 - Run the test by `node bin/new_register.js`

 # Test Cases
  - `bin/ioreg.js` simulates a cloud-enabler device posts a packet to server 
  - `bin/new_one_device.js` simulates a user registers three devices on the server, each device has three registers. 
  - `bin/register_edit` simulates a user modifies the settings of a device. 
  - ...

# Reference
 - [Cloud Enabler API](https://api.ksmt.co/#/)