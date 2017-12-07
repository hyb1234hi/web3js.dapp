App = {
    web3Provider: null,
    contracts: {},
    helpers: {},
  
    init: function() {
        return App.initWeb3();
    },
  
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            console.log('using metamask provider');
        } else {
            // this fallback is for development use
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            console.log('no injected web3 instance detected');
        }
        web3 = new Web3(App.web3Provider);
        console.log('using account:');
        console.log(web3.eth.accounts[0]);
        return App.initializeEntityTrackerContract();
    },
  
    initializeEntityTrackerContract: function() {
        $.getJSON('EntityTracker.json', function(json) {
            App.contracts.EntityTracker = TruffleContract(json);
            App.contracts.EntityTracker.setProvider(App.web3Provider);
            console.log('EntityTracker contract initialized:')
            console.log(App.contracts.EntityTracker);
            return App.bindUserInterface();
        });
    },
  
    bindUserInterfaceEvents: function() {
        $(document).on('click', '#btn-entity-submit', App.submitNewEntity);
    },

    bindUserInterface: function() {
        App.helpers.isLoading(false);

        var entityTrackerInstance;
        App.contracts.EntityTracker.deployed().then(function(instance) {
            entityTrackerInstance = instance;
            return entityTrackerInstance.getEntity.call();
        }).then(function(entity) {
            console.log('payload from initial contract call:');
            console.log(entity)
            App.helpers.updateEntityCard(entity[0], entity[1]);
        });

        return App.watchContractEvent();
    },

    watchContractEvent: function() {
        App.contracts.EntityTracker.deployed().then(function(instance) {
            console.log('i got here')
            return instance.EntityAdded();
        }).then(function(entityAddedEvent) {
            entityAddedEvent.watch(function (error, result) {
                if (error) {
                    App.helpers.isLoading(false);
                    console.log(error);
                } else {
                    App.helpers.isLoading(false);
                    console.log('event received');
                    console.log('new entity: ' + result.args.name);
                    App.helpers.updateEntityCard(result.args.name, result.args.id);
                }
            });
        })
        .catch(function(err) {
            console.log(err.message);
        });

        return App.bindUserInterfaceEvents();
    },

    submitNewEntity: function(event) {
        event.preventDefault();

        var entityId = parseInt($('#entityid').val());
        var entityName = $('#entityname').val();

        if (isNaN(entityId) || !entityName) {
            alert('invalid input data');
        }

        App.helpers.isLoading(true);

        web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];

        // get the contract and execute the transaction
        App.contracts.EntityTracker.deployed().then(function(instance) {
            return instance.setEntity(entityName, entityId, {
                    from: account
                });
            }).then(function(response) {
                console.log('set entity transaction response:')
                console.log(response);
            })
            .catch(function(err) {
                App.helpers.isLoading(false);
                console.log(err.message);
            });
        });
    },
    helpers: {
        updateEntityCard: function(name, id) {
            $("#ename").text(name);
            $("#eid").text(id);
        },
        isLoading: function(bool) {
            if (bool) {
                $("#loader").show();
                $("#entitycard").hide();
            } else {
                $("#loader").hide();
                $("#entitycard").show();
            }
        }
    }
  };
  
  $(function() {
    $(window).load(function() {
        App.init();
    });
  });