<?php

namespace spec\FBS\CoreBundle\Service\Sequence;

use PhpSpec\ObjectBehavior;
use FBS\CoreBundle\Service\Sequence\SequenceService;

class SequenceServiceSpec extends ObjectBehavior
{

    function it_is_initializable()
    {
        $this->shouldHaveType(SequenceService::class);
    }

}
