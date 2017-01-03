'use strict';
import conf from '../vkConfig.js';

/**
 * Function change Element in arrays
 * @param oneList
 * @param twolist
 * @param id
 */
let changeElem = function (oneList , twolist , id , boolean) {
    oneList.forEach( ( item, i ) => {
        if( item.uid  == id  ) {

            if (boolean === true) {
                twolist.unshift(item);
            } else {
                twolist.push(item);
            }
            oneList.splice(i,1);
        }
        return twolist;
    });
};

new Promise( resolve =>  {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then( () => {
    return new Promise( (resolve, reject) => {
        VK.init({
            apiId: conf.configuration.apiId
        });

        VK.Auth.login( response =>  {
            if (response.session) {
                resolve(response);
            } else {
                reject( new Error('Не удалось авторизоваться') );
            }
        }, 8);
    });
}).then( () =>  {
    return new Promise( (resolve, reject) => {
        VK.api('friends.get', {'fields' : 'nickname,photo_100'}, response =>  {

            if (response.error) {
                reject( new Error(response.error.error_msg) );
            } else {

                let data_cache_just      = response.response;
                let data_cache_best      = new Array;

                if (localStorage.getItem('just') !== null && localStorage.getItem('best') !== null ) {
                    data_cache_just      = JSON.parse(localStorage.getItem('just'));
                    data_cache_best      = JSON.parse(localStorage.getItem('best'));
                }

                let best_friend      = document.getElementById('best-friend');
                let just_friend      = document.getElementById('just-friend');
                let search           = document.querySelector('.search');

                let button_save      = document.querySelector('save');
                let justriend        = document.getElementById('just-friend');
                let source           = document.getElementById('playerItemTemplate').innerHTML;
                let templateFn       = Handlebars.compile(source);
                let template         = templateFn({list: data_cache_just});
                justriend.innerHTML  = template;

                let newtemplate           = templateFn({list: data_cache_best});
                best_friend.innerHTML     = newtemplate;


                let friends_block    = document.querySelector('.friends-block');

                friends_block.addEventListener('click', e => {
                    if ( e.target.className === 'glyphicon' ) {

                        if ( e.target.parentNode.parentNode.parentNode.parentNode.id == 'best-friend' ) {
                            changeElem(data_cache_best,data_cache_just,e.target.parentNode.parentNode.parentNode.getAttribute('data-id'));
                            just_friend.insertBefore(e.target.parentNode.parentNode.parentNode,just_friend.firstChild);
                        } else {
                            changeElem(data_cache_just,data_cache_best,e.target.parentNode.parentNode.parentNode.getAttribute('data-id'));
                            best_friend.appendChild( e.target.parentNode.parentNode.parentNode);
                        }
                    }
                });
                search.addEventListener('input', e => {
                    let newList     = new Array;
                    let test        = just_friend.querySelectorAll('.friends-item');

                    if ( e.target.className === 'search-input-just') {
                        let search_just = data_cache_just;

                        for (let name in search_just) {

                            if (`${search_just[name].first_name} ${search_just[name].last_name}`.indexOf(e.target.value, 0) != -1) {
                                newList.push( search_just[name] );
                            }
                        }
                        let template        = templateFn({list: newList});
                        justriend.innerHTML = template;
                    } else {
                        let search_best = data_cache_best;
                        for (let name in search_best) {
                            if (`${search_best[name].first_name} ${search_best[name].last_name}`.indexOf(e.target.value, 0) != -1) {
                                newList.push(search_best[name]);
                            }
                        }
                        let template          = templateFn({list: newList});
                        best_friend.innerHTML = template;
                    }
                });

                friends_block.addEventListener( 'dragstart' , e => {
                    e.target.style.opacity = '0.4';

                    e.dataTransfer.setData("Text",e.clientX );
                    e.dataTransfer.setData("node",e.target.getAttribute('data-id'));

                    e.target.parentNode.parentNode.id === 'list-friend' ? e.dataTransfer.setData("type",'list-friend') :  e.dataTransfer.setData("type",'no-list-friend');
                });
                let AllWidth         = document.body.offsetWidth; //1436
                let widthBlock       = document.querySelector('.friends-block').offsetWidth; //620

                let side             = (AllWidth-widthBlock)/2; //406
                let rightmost_point  = AllWidth-side; //1030
                let in_left_point    = rightmost_point-widthBlock/2;
                let start_point      = (AllWidth-widthBlock)/2; //406

                friends_block.addEventListener('drop', e => {
                    e.preventDefault();
                    if( e.dataTransfer.getData('Text') > start_point && e.dataTransfer.getData('Text')  < in_left_point)
                    {

                        if( in_left_point < e.clientX &&  rightmost_point > e.clientX ) {
                            in_change(e.dataTransfer.getData("type"),e.dataTransfer.getData("node"));
                            let template              = templateFn({list: data_cache_best});
                            best_friend.innerHTML     = template;
                            let neewtemplate          = templateFn({list: data_cache_just});
                            justriend.innerHTML       = neewtemplate;
                        }
                    } else {
                        if( in_left_point > e.clientX &&  start_point < e.clientX ) {
                            in_change(e.dataTransfer.getData("type"),e.dataTransfer.getData("node"));
                            let template              = templateFn({list: data_cache_best});
                            best_friend.innerHTML     = template;
                            let neewtemplate          = templateFn({list: data_cache_just});
                            justriend.innerHTML       = neewtemplate;
                        }
                    }

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                });

                friends_block.addEventListener('dragend', e => {
                    e.target.style.opacity = '1.0';
                });

                friends_block.addEventListener('dragover', e => {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.dataTransfer.dropEffect = 'move';
                    return false;
                });

                save.addEventListener('click', () => {
                    localStorage.setItem('just', JSON.stringify(data_cache_just));
                    localStorage.setItem('best', JSON.stringify(data_cache_best));
                });

                function in_change(type , node) {

                    if (type  === 'list-friend') {
                        changeElem(data_cache_just , data_cache_best , node);
                    } else {
                        changeElem(data_cache_best , data_cache_just , node , true);
                    }
                }
            }
        });
    })
});