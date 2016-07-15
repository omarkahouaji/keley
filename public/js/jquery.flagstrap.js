/*
 *  FlagStrap - v1.0
 *  A lightwieght jQuery plugin for creating Bootstrap 3 compatible country select boxes with flags.
 *  http://www.blazeworx.com/flagstrap
 *
 *  Made by Alex Carter
 *  Under MIT License
 */
(function ($) {

    var defaults = {
        buttonSize: "btn-md",
        buttonType: "btn-default",
        labelMargin: "10px",
        scrollable: true,
        scrollableHeight: "250px",
        placeholder: {
            value: '',
            text: 'Veuillez choisir un pays' 
        }
    };

  var countries = {
       "AF": "Afghanistan",
        "AL": "Albanie",
        "DZ": "Algérie",
        "AS": "American Samoa",
        "AD": "Andorra",
        "AO": "Angola",
        "AI": "Anguilla",
        "AG": "Antigua-et-Barbuda",
        "AR": "Argentine",
        "AM": "Arménie",
        "AW": "Aruba",
        "AU": "Australia",
        "AT": "Autriche",
        "AZ": "l'Azerbaïdjan",
        "BS": "Bahamas",
        "BH": "Bahreïn",
        "BD": "Bangladesh",
        "BB": "Barbados",
        "PAR": "Biélorussie",
        "BE": "Belgique",
        "BZ": "Belize",
        "BJ": "Bénin",
        "BM": "Bermuda",
        "BT": "Bhoutan",
        "BO": "Bolivie, État plurinational de",
        "BA": "Bosnie-Herzégovine",
        "BW": "Botswana",
        "BV": "Île Bouvet",
        "BR": "Brésil",
        "IO": "Territoire britannique de l'océan Indien",
        "BN": "Brunei Darussalam",
        "BG": "la Bulgarie",
        "BF": "Burkina Faso",
        "BI": "Burundi",
        "KH": "Cambodge",
        "CM": "Cameroun",
        "CA": "Canada",
        "CV": "Cap-Vert",
        "KY": "îles Caïmans",
        "CF": "République centrafricaine",
        "TD": "Tchad",
        "CL": "Chili",
        "CN": "Chine",
        "CO": "Colombie",
        "KM": "Comores",
        "CG": "Congo",
        "CD": "Congo, la République démocratique du",
        "CK": "îles Cook",
        "CR": "Costa Rica",
        "CI": "C" + "&ocirc;" + "te d'Ivoire",
        "HR": "Croatie",
        "CU": "Cuba",
        "CW": "Cura" + "& ccedil;" + "Ao",
        "CY": "Chypre",
        "CZ": "République tchèque",
        "DK": "le Danemark",
        "DJ": "Djibouti",
        "DM": "Dominique",
        "DO": "République dominicaine",
        "CE": "Equateur",
        "Ex": "l'Egypte",
        "SV": "El Salvador",
        "GQ": "Guinée équatoriale",
        "ER": "l'Erythrée",
        "EE": "Estonie",
        "ET": "Ethiopie",
        "FK": "Îles Falkland (Malvinas)",
        "FO": "îles Féroé",
        "FJ": "Fidji",
        "FI": "la Finlande",
        "FR": "France",
        "GF": "Guyane française",
        "PF": "Polynésie française",
        "TF": "Terres australes françaises",
        "GA": "Gabon",
        "GM": "Gambie",
        "GE": "Georgia",
        "DE": "Allemagne",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GR": "Grèce",
        "GL": "Groenland",
        "GD": "Grenade",
        "GP": "Guadeloupe",
        "GU": "Guam",
        "GT": "Guatemala",
        "GG": "Guernsey",
        "GN": "Guinée",
        "GW": "Guinée-Bissau",
        "GY": "Guyane",
        "HT": "Haïti",
        "HM": "Les îles Heard et McDonald",
        "VA": "Saint-Siège (Cité du Vatican)",
        "HN": "Honduras",
        "HK": "Hong Kong",
        "HU": "Hongrie",
        "IS": "l'Islande",
        "En": "Inde",
        "ID": "Indonésie",
        "IR": "l'Iran, République islamique d '",
        "QI": "l'Irak",
        "IE": "Irlande",
        "IM": "Isle of Man",
        "IL": "Israël",
        "IT": "Italie",
        "JM": "Jamaica",
        "JP": "Japon",
        "JE": "Jersey",
        "JO": "Jordanie",
        "KZ": "Kazakhstan",
        "KE": "Kenya",
        "KI": "Kiribati",
        "KP": "La Corée, République populaire démocratique de",
        "KR": "La Corée, République de",
        "KW": "Koweït",
        "KG": "Kirghizistan",
        "LV": "la Lettonie",
        "LB": "Liban",
        "LS": "Lesotho",
        "LR": "Liberia",
        "LY": "la Libye",
        "LI": "Liechtenstein",
        "LT": "Lituanie",
        "LU": "Luxembourg",
        "MO": "Macao",
        "MK": "Macédoine, l'ex-République yougoslave de",
        "MG": "Madagascar",
        "MW": "Malawi",
        "MY": "la Malaisie",
        "MV": "Maldives",
        "ML": "Mali",
        "MT": "Malte",
        "MH": "Îles Marshall",
        "MQ": "Martinique",
        "MR": "Mauritanie",
        "MU": "Maurice",
        "YT": "Mayotte",
        "MX": "le Mexique",
        "FM": "Micronésie, États fédérés de",
        "MD": "République de Moldova",
        "MC": "Monaco",
        "MN": "Mongolie",
        "ME": "Monténégro",
        "MS": "Montserrat",
        "MA": "Maroc",
        "MZ": "Mozambique",
        "MM": "Myanmar",
        "NA": "Namibia",
        "NR": "Nauru",
        "NP": "Népal",
        "NL": "Pays-Bas",
        "NC": "Nouvelle-Calédonie",
        "NZ": "Nouvelle-Zélande",
        "NI": "Nicaragua",
        "NE": "Niger",
        "NG": "Nigeria",
        "NU": "Nioué",
        "NF": "Norfolk Island",
        "MP": "Îles Mariannes du Nord",
        "NON": "Norvège",
        "OM": "Oman",
        "PK": "Pakistan",
        "PW": "Palau",
        "PS": "Territoire palestinien, occupé",
        "PA": "Panama",
        "PG": "Papouasie-Nouvelle-Guinée",
        "PY": "Paraguay",
        "PE": "Pérou",
        "PH": "Philippines",
        "PN": "Pitcairn",
        "PL": "Pologne",
        "PT": "Portugal",
        "PR": "Puerto Rico",
        "QA": "Qatar",
        "RE": "R" + "& eacute;" + "Union",
        "RO": "Roumanie",
        "RU": "Fédération de Russie",
        "RW": "Rwanda",
        "SH": "Sainte-Hélène, Ascension et Tristan da Cunha",
        "KN": "Saint-Kitts-et-Nevis",
        "LC": "Saint Lucia",
        "MF": "Saint Martin (partie française)",
        "PM": "Saint-Pierre-et-Miquelon",
        "VC": "Saint-Vincent-et-les-Grenadines",
        "WS": "Samoa",
        "SM": "San Marino",
        "ST": "Sao Tomé-et-Principe",
        "SA": "Arabie Saoudite",
        "SN": "Sénégal",
        "RS": "Serbie",
        "SC": "Seychelles",
        "SL": "Sierra Leone",
        "SG": "Singapour",
        "SX": "Sint Maarten (partie néerlandaise)",
        "SK": "Slovaquie",
        "SI": "Slovénie",
        "SB": "îles Salomon",
        "SO": "Somalie",
        "ZA": "Afrique du Sud",
        "GS": "la Géorgie du Sud et les îles Sandwich du Sud",
        "SS": "Sud-Soudan",
        "ES": "Espagne",
        "LK": "Sri Lanka",
        "SD": "Soudan",
        "SR": "Suriname",
        "SZ": "Swaziland",
        "SE": "Suède",
        "CH": "La Suisse",
        "SY": "République arabe syrienne",
        "TW": "Taiwan, province de Chine",
        "TJ": "Tadjikistan",
        "TZ": "la Tanzanie, République-Unie de",
        "TH": "Thaïlande",
        "TL": "Timor-Leste",
        "TG": "Togo",
        "TK": "Tokelau",
        "TO": "Tonga",
        "TT": "Trinité-et-Tobago",
        "TN": "Tunisie",
        "TR": "Turquie",
        "TM": "Turkménistan",
        "TC": "Îles Turques et Caïques",
        "TV": "Tuvalu",
        "UG": "Ouganda",
        "UA": "Ukraine",
        "AE": "Emirats Arabes Unis",
        "GB": "Royaume-Uni",
        "US": "Etats-Unis",
        "UM": "Les Etats-Unis Îles mineures éloignées",
        "UY": "Uruguay",
        "UZ": "Ouzbékistan",
        "VU": "Vanuatu",
        "VE": "Venezuela, République bolivarienne du",
        "VN": "Viet Nam",
        "VG": "Îles Vierges britanniques",
        "VI": "Virgin Islands, États-Unis",
        "WF": "Wallis et Futuna",
        "EH": "Sahara Occidental",
        "YE": "Yémen",
        "ZM": "la Zambie",
        "ZW": "Zimbabwe"
    };

    $.flagStrap = function (element, options, i) {

        var plugin = this;

        var uniqueId = generateId(8);

        plugin.countries = {};
        plugin.selected = {value: null, text: null};
        plugin.settings = {inputName: 'country-' + uniqueId};

        var $container = $(element);
        var htmlSelectId = 'flagstrap-' + uniqueId;
        var htmlSelect = '#' + htmlSelectId;

        plugin.init = function () {

            // Merge in global settings then merge in individual settings via data attributes
            plugin.countries = countries;

            // Initialize Settings, priority: defaults, init options, data attributes
            plugin.countries = countries;
            plugin.settings = $.extend({}, defaults, options, $container.data());

            if (undefined !== plugin.settings.countries) {
                plugin.countries = plugin.settings.countries;
            }

            if (undefined !== plugin.settings.inputId) {
                htmlSelectId = plugin.settings.inputId;
                htmlSelect = '#' + htmlSelectId;
            }

            // Build HTML Select, Construct the drop down button, Assemble the drop down list items element and insert
            $container
                .addClass('flagstrap')
                .append(buildHtmlSelect)
                .append(buildDropDownButton)
                .append(buildDropDownButtonItemList);

            // Check to see if the onSelect callback method is assigned / callable, bind the change event for broadcast
            if (plugin.settings.onSelect !== undefined && plugin.settings.onSelect instanceof Function) {
                $(htmlSelect).change(function (event) {
                    var element = this;
                    options.onSelect($(element).val(), element);
                });
            }

            // Hide the actual HTML select
            $(htmlSelect).hide();

        };

        var buildHtmlSelect = function () {
            var htmlSelectElement = $('<select/>').attr('id', htmlSelectId).attr('name', plugin.settings.inputName);

            $.each(plugin.countries, function (code, country) {
                var optionAttributes = {value: code};
                if (plugin.settings.selectedCountry !== undefined) {
                    if (plugin.settings.selectedCountry === code) {
                        optionAttributes = {value: code, selected: "selected"};
                        plugin.selected = {value: code, text: country}
                    }
                }
                htmlSelectElement.append($('<option>', optionAttributes).text(country));
            });

            if (plugin.settings.placeholder !== false) {
                htmlSelectElement.prepend($('<option>', {
                    value: plugin.settings.placeholder.value,
                    text: plugin.settings.placeholder.text
                }));
            }

            return htmlSelectElement;
        };

        var buildDropDownButton = function () {

            var selectedText = $(htmlSelect).find('option').first().text();
            var selectedValue = $(htmlSelect).find('option').first().val();

            selectedText = plugin.selected.text || selectedText;
            selectedValue = plugin.selected.value || selectedValue;

            if (selectedValue !== plugin.settings.placeholder.value) {
                var $selectedLabel = $('<i/>').addClass('flagstrap-icon flagstrap-' + selectedValue.toLowerCase()).css('margin-right', plugin.settings.labelMargin);
            } else {
                var $selectedLabel = $('<i/>').addClass('flagstrap-icon flagstrap-placeholder');
            }

            var buttonLabel = $('<span/>')
                .addClass('flagstrap-selected-' + uniqueId)
                .html($selectedLabel)
                .append(selectedText);

            var button = $('<button/>')
                .attr('type', 'button')
                .attr('data-toggle', 'dropdown')
                .attr('id', 'flagstrap-drop-down-' + uniqueId)
                .addClass('btn ' + plugin.settings.buttonType + ' ' + plugin.settings.buttonSize + ' dropdown-toggle')
                .css("width","100%")
                .html(buttonLabel);

            $('<span/>')
                .addClass('caret')
                .css('margin-left', plugin.settings.labelMargin)
                .insertAfter(buttonLabel);

            return button;

        };

        var buildDropDownButtonItemList = function () {
            var items = $('<ul/>')
                .attr('id', 'flagstrap-drop-down-' + uniqueId + '-list')
                .attr('aria-labelled-by', 'flagstrap-drop-down-' + uniqueId)
                .addClass('dropdown-menu');

            if (plugin.settings.scrollable) {
                items.css('height', 'auto')
                    .css('max-height', plugin.settings.scrollableHeight)
                    .css('overflow-x', 'hidden');
            }

            // Populate the bootstrap dropdown item list
            $(htmlSelect).find('option').each(function () {

                // Get original select option values and labels
                var text = $(this).text();
                var value = $(this).val();

                // Build the flag icon
                if (value !== plugin.settings.placeholder.value) {
                    var flagIcon = $('<i/>').addClass('flagstrap-icon flagstrap-' + value.toLowerCase()).css('margin-right', plugin.settings.labelMargin);
                } else {
                    var flagIcon = null;
                }


                // Build a clickable drop down option item, insert the flag and label, attach click event
                var flagStrapItem = $('<a/>')
                    .attr('data-val', $(this).val())
                    .html(flagIcon)
                    .append(text)
                    .on('click', function (e) {
                        $(htmlSelect).find('option').removeAttr('selected');
                        $(htmlSelect).find('option[value="' + $(this).data('val') + '"]').attr("selected", "selected");
                        $(htmlSelect).trigger('change');
                        $('.flagstrap-selected-' + uniqueId).html($(this).html());
                        e.preventDefault();
                    });

                // Make it a list item
                var listItem = $('<li/>').prepend(flagStrapItem);

                // Append it to the drop down item list
                items.append(listItem);

            });

            return items;
        };

        function generateId(length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

            if (!length) {
                length = Math.floor(Math.random() * chars.length);
            }

            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        }

        plugin.init();

    };

    $.fn.flagStrap = function (options) {

        return this.each(function (i) {
            if ($(this).data('flagStrap') === undefined) {
                $(this).data('flagStrap', new $.flagStrap(this, options, i));
            }
        });

    }

})(jQuery);
