import React, { useEffect, useState } from 'react';
import './footer.css';
// import '../../public/bootstrap/css/bootstrap.min.css'
// Simple counter using React Hooks
export const Footer = () => {

    return (
        <>
            <footer>
                <div className="container py-4 py-lg-5">
                    <div className="row row-cols-2 row-cols-md-4">
                        <div className="col-12 col-md-3 col-xl-3">
                            <div className="fw-bold d-flex align-items-center mb-2"><span className='white-text'>Red Giant Staking</span></div>
                            <p className="text-muted">Submit an issue:<br />redgianttoken@gmail.com</p>
                            <p className="text-muted">Create your own pool</p>
                        </div>
                    </div>
                    <hr />
                    <div className="text-muted d-flex justify-content-between align-items-center pt-3">
                        <p className="mb-0 white-text">Copyright © 2022 Red Giant</p>
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item"><a href="https://t.me/RedG2023"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-telegram white-text font-24">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"></path>
                            </svg></a></li>
                            <li className="list-inline-item"><a href="https://twitter.com/RedGiantToken?t=pl_mzWU5PGsy3V5c7NQY0Q&amp;s=09"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-twitter white-text font-24">
                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
                            </svg></a></li>
                            <li className="list-inline-item"><a href="https://assuredefi.com/">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 576 576" width="1em" height="1em" fill="currentColor" className="white-text font-32 mb-0">
                                    <path d="M208 48C208 74.51 186.5 96 160 96C133.5 96 112 74.51 112 48C112 21.49 133.5 0 160 0C186.5 0 208 21.49 208 48zM152 352V480C152 497.7 137.7 512 120 512C102.3 512 88 497.7 88 480V256.9L59.43 304.5C50.33 319.6 30.67 324.5 15.52 315.4C.3696 306.3-4.531 286.7 4.573 271.5L62.85 174.6C80.2 145.7 111.4 128 145.1 128H174.9C208.6 128 239.8 145.7 257.2 174.6L302.1 249.3C285.1 266.9 273.4 287.7 265.5 310.8C263.6 308.9 261.1 306.8 260.6 304.5L232 256.9V480C232 497.7 217.7 512 200 512C182.3 512 168 497.7 168 480V352L152 352zM576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM476.7 324.7L416 385.4L387.3 356.7C381.1 350.4 370.9 350.4 364.7 356.7C358.4 362.9 358.4 373.1 364.7 379.3L404.7 419.3C410.9 425.6 421.1 425.6 427.3 419.3L499.3 347.3C505.6 341.1 505.6 330.9 499.3 324.7C493.1 318.4 482.9 318.4 476.7 324.7H476.7z"></path>
                                </svg></a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};