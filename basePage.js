var env = process.env.NODE_ENV.trim();
console.log("env =", typeof env, env);
var path = require('path');
var BasePage = function () {
    var EC = protractor.ExpectedConditions;

    /**
     * wait for ele,
     **/
    this.waitForElement = function (locator) {
        return browser.wait(locator, this.timeout.xxl);
    };

    /**
     * move mouse
     **/
    this.moveMouse = function (locator) {
        browser.actions().mouseMove(locator, { x: 10, y: 10 }).perform();
    };

	/**
	* @elem = Element you want to move;
    * @target = Element where you want to drop elem;
	**/

    this.dragandDrop = function (elem, target) {
        browser.actions().dragAndDrop(elem, target).mouseUp().perform();
    }

    this.checkTextBy = function (elementBy, expectedValue, timeout) {
        console.log('Checking ' + elementBy + ' text to be ' + expectedValue);
        this.checkTextByElement(element(elementBy), expectedValue, timeout);
    };

    this.checkTextByElement = function (element, expectedValue, timeout) {
        this.waitVisibleElement(element, timeout);
        element.getText().then(function (text) {
            var value = text.trim();
            console.log('ressss:' + value);
            expect(value).toEqual(expectedValue);
        })
    };

    this.click = function (elementBy, timeout) {
        console.log('Clicking to element ' + elementBy);
        return this.clickElement(element(elementBy), timeout);
    };

    /**
     * Fail safe click.
     * Tries to click an element 5 times before fail
     * Uses fluent time interval before clicks
     * Avoids clicking scrollbar on small screen sizes
     *
     * @param element to be clicked
     * @param timeout to wait element visible
     * @returns click promise
     */
    this.clickElement = function (element, timeout) {
        this.waitVisibleElement(element, timeout);
        var i = 0;
        return clickIt();
        function clickIt() {
            return element.click().then(
                function (clicked) {
                    return clicked;
                },
                function (error) {
                    if (++i <= 5) {
                        browser.driver.sleep(i * 500);
                        browser.executeScript('window.scrollBy(0,250)');
                        return clickIt();
                    }
                    fail(error);
                }
            )
        }
    };

    this.dropDownListCheck = function (elementBy, expectedArray) {
        element.all(elementBy).map(function (elm) {
            return elm.getText();
        }).then(function (actualArray) {
            var sortedActualArray = actualArray.sort();
            var sortedExpectedArray = expectedArray.sort();
            var i = 0;
            sortedActualArray.forEach(function (item) {
                expect(item).toEqual(sortedExpectedArray[i]);
                console.log('Actual list item: ' + item + '\nExpected list item: ' + sortedExpectedArray[i]);
                i = i + 1;
            });
        });
    };

    this.waitUrl = function (urlExpected, timeout) {
        console.log('Waiting for URL to be ' + urlExpected);
        if (!timeout) {
            timeout = browser.params.timeout.urlChangeTimeout;
        }
        return browser.wait(function () {
            return browser.getCurrentUrl().then(function (url) {
                browser.driver.sleep(1000);
                return url.startsWith(browser.baseUrl + urlExpected);
            })
        }, timeout, 'Failed to load page: ' + urlExpected + '. Timeout: ' + timeout + 'ms.');
    };

    this.waitVisibleBy = function (elementBy, timeout) {
        console.log('Searching for element ' + elementBy + ' and checking its visibility');
        return this.waitVisibleElement(element(elementBy), timeout);
    };

    this.waitVisibleElement = function (element, timeout) {
        if (!timeout) {
            timeout = browser.params.timeout.elementVisibilityTimeout;
        }
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.visibilityOf(element, timeout,
            'Failed to find element ' + '. Timeout: ' + timeout + 'ms.'));
    };

    this.checkPresenceBy = function (elementBy, expectedValue) {
        console.log('Checking presence of element ' + elementBy);
        this.isPresentElement(element(elementBy)).then(function (currentValue) {
            console.log('Checking element ' + elementBy + ' presence to be ' + expectedValue);
            expect(currentValue).toBe(expectedValue);
        })
    };

    this.isPresentElement = function (element) {
        return element.isPresent();
    };

    this.switchToNewTab = function () {
        return browser.getAllWindowHandles().then(function (handles) {
            var newWindowHandle = handles[1];
            return browser.switchTo().window(newWindowHandle.toString());
        });
    };

    this.switchToPreviousTab = function () {
        return browser.getAllWindowHandles().then(function (handles) {
            previousWindowHandle = handles[0];
            return browser.switchTo().window(previousWindowHandle);
        });
    };

    this.switchToAlert = function (timeout) {
        if (!timeout) {
            timeout = browser.params.timeout.elementVisibilityTimeout;
        }
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.alertIsPresent(), timeout,
            'Failed to find alert ' + '. Timeout: ' + timeout + 'ms.').then(function () {
                return browser.switchTo().alert();
            })
    };

    this.dragNDropBy = function (fromElemBy, toElemBy, sleep, sleep2, timeout) {
        console.log("Drag " + fromElemBy + " to " + toElemBy);
        this.dragNDropElement(element(fromElemBy), element(toElemBy), sleep, sleep2, timeout);
    };

    this.dragNDropElement = function (fromElem, toElem, sleep1, sleep2, timeout) {
        this.waitVisibleElement(fromElem, timeout);
        this.waitVisibleElement(toElem, timeout);
        browser.driver.actions().mouseMove(fromElem).perform();
        if (sleep1) {
            browser.driver.sleep(sleep1);
        }
        browser.driver.actions().mouseDown().mouseMove(toElem).perform();
        if (sleep2) {
            browser.driver.sleep(sleep2);
        }
        browser.driver.actions().mouseUp().perform();
    };

    this.dragNDropElementToLocation = function (fromElem, toLocation, sleep1, sleep2, timeout) {
        this.waitVisibleElement(fromElem, timeout);
        browser.driver.actions().mouseMove(fromElem).perform();
        if (sleep1) {
            browser.driver.sleep(sleep1);
        }
        browser.driver.actions().mouseDown().mouseMove(toLocation).perform();
        if (sleep2) {
            browser.driver.sleep(sleep2);
        }
        browser.driver.actions().mouseUp().perform();
    };

    this.mouseOverBy = function (elementBy, timeout) {
        console.log('Mouse over element' + elementBy);
        this.mouseOverElement(element(elementBy), timeout);
    };

    this.mouseOverElement = function (element, timeout) {
        this.waitVisibleElement(element, timeout);
        browser.driver.actions().mouseMove(element).perform();
    };

    this.sendKeysBy = function (elementBy, value, timeout) {
        this.sendKeysElement(element(elementBy), value, timeout);
    };

    this.sendKeysElement = function (element, value, timeout) {
        this.waitVisibleElement(element, timeout);
        element.clear().sendKeys(value);
    };

    this.waitInvisibleBy = function (elementBy, timeout) {
        console.log('Searching for element ' + elementBy + ' and checking its invisibility');
        this.waitInvisibleElement(element(elementBy), timeout);
    };

    this.waitInvisibleElement = function (element, timeout) {
        if (!timeout) {
            timeout = browser.params.timeout.elementInvisibilityTimeout;
        }
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.invisibilityOf(element, timeout,
            'Failed to find invisible element' + '. Timeout: ' + timeout + 'ms.'));
    };

    this.refreshPage = function () {
        return browser.driver.navigate().refresh();
    };

    this.openNewWindow = function () {
        browser.executeScript('window.open()');
    };

    this.getAttributeValueByElement = function (element, attribute, timeout) {
        this.waitVisibleElement(element, timeout);
        return element.getAttribute(attribute);
    };

    this.getAttributeValueBy = function (elementBy, attribute, timeout) {
        this.waitVisibleBy(elementBy, timeout);
        return element(elementBy).getAttribute(attribute);
    };

    this.acceptAlert = function () {
        return browser.switchTo().alert().accept();
    };

    this.switchToAlert = function () {
        return browser.switchTo().alert();
    };

    this.selectOptionBy = function (elementBy, option, timeout) {
        return this.selectOptionElement(element(elementBy), option, timeout)
    };

    this.selectOptionElement = function (element, option, timeout) {
        this.waitVisibleElement(element, timeout);
        return element.element(By.cssContainingText('option', option)).click();
    };

    this.getSelectedOption = function (elem) {
        return elem.element(by.css('option:checked')).getText().then(function (value) {
            return value.trim();
        });
    };

    this.getSelectedOptionBy = function (elem) {
        return this.getSelectedOption(element(elem));
    };

    this.ctrlClickBy = function (elementBy, timeout) {
        return this.ctrlClickElement(element(elementBy), timeout);
    };

    this.ctrlClickElement = function (element, timeout) {
        this.waitVisibleElement(element, timeout);
        return browser.actions()
            .mouseMove(element)
            .keyDown(protractor.Key.CONTROL)
            .click()
            .keyUp(protractor.Key.CONTROL)
            .perform();
    };

    this.clickCoordinates = function (byX, byY) {
        return browser.actions()
            .mouseMove(element(By.css('body')), { x: byX, y: byY })
            .click()
            .perform();
    };

    this.ctrlZ = function () {
        element(By.css('body')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'Z'));
    };

    this.ctrlS = function () {
        element(By.css('body')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'S'));
    };

    this.waitUntilClickableElement = function (element, timeout) {
        this.waitVisibleElement(element, timeout);
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.elementToBeClickable(element, timeout,
            'Failed to know if element is clickable' + '. Timeout: ' + timeout + 'ms.'));
    };

    this.waitUntilClickableBy = function (elementBy, timeout) {
        console.log('Checking ' + elementBy + 'to be clickable');
        this.waitUntilClickableElement(element(elementBy), timeout);
    };

    this.elementHasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    this.createRandomText = function (textValue) {
        return Date.now().toString() + textValue;
    };

    this.getLastEmailImap_user = function () {
        var deferred = protractor.promise.defer();
        console.log("Waiting for an email...");
        mailListener_user.on("mail", function (mail) {
            deferred.fulfill(mail);
        });
        return deferred.promise;
    };

    /**
     * verify By Text
     * @locator= element locator
     * @expectedData = value to assert with
     **/
    this.verifyByText = function (locator, expectedData) {
        expect(locator.getText()).toEqual(expectedData);
    };

    /**
     * verify by match Text
     * @locator= element locator
     * @expectedData = value to assert with
     **/
    this.verifyByMatchText = function (locator, expectedData) {
        expect(locator.getText()).toMatch(expectedData);
    };

    /**
     * verify by contain Text
     * @locator= element locator
     * @expectedData = value to assert with
     **/
    this.verifyByContainsText = function (locator, expectedData) {
        expect(locator.getText()).toContain(expectedData);
    };

    /**
     *verify By Attribute
     *@locator = element locator
     *@attribute = attribute for getting data
     *@expData = value to assert with
     **/
    this.verifyByAttribute = function (locator, attribute, expData) {
        expect(locator.getAttribute(attribute)).toEqual(expData);
    };
    /**
     * navigate to a page via it's `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `pageLoaded` properties
     */
    this.to = function () {
        browser.get(this.url, this.timeout.xxl);
        return this.at();
    };

    /*****upload file***/
    this.uploadFile = function (fileToUpload) {
        browser.executeAsyncScript(function (callback) {
            // You can use any other selector
            document.querySelectorAll('input[type="file"]')[0]
                .style.display = 'visibility: hidden; position: absolute; top: 0px; left: 0px; height: 0px; width: 0px;';
            callback();
        });
        var absolutePath = path.resolve(__dirname, fileToUpload);
        // Now you can upload.
        $('input[type="file"]').sendKeys(absolutePath);

    };

    /**
     * Wrappers for expected conditions
     *
     * I find ECs are generally poorly named, so we wrap them in
     * methods that are 9% more sexy, and allow us to add logging, etc...
     *
     * @returns {ExpectedCondition}
     */

    this.isVisible = function (locator) {
        return EC.visibilityOf(locator);
    };

    this.isNotVisible = function (locator) {
        return EC.invisibilityOf(locator);
    };

    this.inDom = function (locator) {
        return EC.presenceOf(locator);
    };

    this.notInDom = function (locator) {
        return EC.stalenessOf(locator);
    };

    this.isClickable = function (locator) {
        return EC.elementToBeClickable(locator);
    };

    this.hasText = function (locator, text) {
        return EC.textToBePresentInElement(locator, text);
    };

    this.and = function (arrayOfFunctions) {
        return EC.and(arrayOfFunctions);
    };

    this.getFullDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = mm + '/' + dd + '/' + yyyy;
        return today;
    };

    this.getFullDateInOtherFormat = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return today;
    };

    this.titleIs = function (title) {
        browser.getTitle().then(function (t) {
            //console.log('----------------------------------title = ', t, 'should match: ', title);
        });
        return EC.titleIs(title);
    };

    /**
     * wrap this.timeout. (ms) in t-shirt sizes
     */
    this.timeout = {
        'xs': 420,
        's': 1000,
        'm': 2000,
        'l': 5000,
        'xl': 9000,
        'xxl': 30000
    };

    /**
     * test if an element has a class
     *
     * @param  {elementFinder} locator - eg. $('div#myId')
     * @param  {string}  klass  - class name
     * @return {Boolean} - does the element have the class?
     */
    this.hasClass = function (locator, klass) {
        return locator.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(klass) !== -1;
        });
    };

    /**
     * Webdriver equivilant to hitting Enter/Return key.
     */
    this.hitEnter = function () {
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    /**
     * switches focus to a new window
     * @param  {int} windowHandleIndex - the nth window to switch to
     * @param  {pageObject} targetPage - the page we'll be on after the switch
     */
    this.switchToWindow = function (windowHandleIndex) {
        var that = this;
        // wait for new page to open...
        var handle = browser.wait(function () {
            return browser.getAllWindowHandles().then(function (handles) {
                // make sure window we're switching to exists...
                if (handles.length > windowHandleIndex) {
                    return handles[windowHandleIndex];
                } else {
                    throw new Error('window index ' + windowHandleIndex + ' does not exist');
                }
            });
        }, this.timeout.xxl);
        console.log('switching to window ' + windowHandleIndex);
        browser.switchTo().window(handle);
        // test that we're at the new page...
        //targetPage.at();
    };


    /**
     * get an element's width
     * extend's protractors ElementFinder
     *
     * @return {int} - the width of the element
     */
    protractor.ElementFinder.prototype.getWidth = function () {
        return this.getSize().then(function (size) {
            return size.width;
        });
    };

    this.getInnerText = function (locator) {
        return locator.getAttribute('innerText');
    };

    this.getElementText = function (locator) {
        return locator.getText();
    };

    this.getElementValue = function (locator) {
        return locator.getAttribute('value');
    };

    this.getElementCount = function (locator) {
        return locator.count();
    };

    this.MoveToElement = function (locator) {
        return browser.actions().mouseMove(locator).perform();
    };

    this.scrollToElementBy= function (locator){
        this.scrollToElement(element(locator));
    };

    this.scrollToElement= function (elem){
        return browser.executeScript('arguments[0].scrollIntoView();',elem);
    };

    this.Wait = function () {
        return browser.waitForAngular();
    };
};
module.exports = new BasePage();
