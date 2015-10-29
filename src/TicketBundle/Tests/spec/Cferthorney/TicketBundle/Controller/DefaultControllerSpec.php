<?php

namespace spec\Cferthorney\TicketBundle\Controller;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class DefaultControllerSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType('Cferthorney\TicketBundle\Controller\DefaultController');
    }
}
