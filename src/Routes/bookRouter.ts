import express from "express";
const bookRouter = express.Router();
import bookController from "../Controllers/bookController";
import { authMiddleware } from "../Controllers/authController";

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /book/:
 *   post:
 *     summary: Create a new book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My New Book"
 *               author:
 *                type: string
 *                example: "Talker"
 *               authorImg:
 *                 type: string
 *                 example: "https://example.com/author.jpg"
 *               hero:
 *                 type: string
 *                 example: "Superman"
 *               description:
 *                 type: string
 *                 example: "This is an amazing book about..."
 *               paragraphs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paragraph 1", "Paragraph 2"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png", "data:image/jpeg;base64,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"]
 *               coverImg:
 *                 type: string
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAeAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgAEAgMHAQj/xAA9EAACAQIEBAQDBQYGAgMAAAABAgMEEQAFEiEGMUFREyJhcRQygUKRobHwBxUjUsHRM2JyouHxQ4IWJWP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAwECBAUG/8QAKREAAgIBBAEDBAIDAAAAAAAAAAECAxEEEiExEyJBUTJhcdGx8AUUI//aAAwDAQACEQMRAD8A6yatWVSjC1rDGqZ3ZgrbAjAaGlqo443Lg2O9jijW1tWKsx3Kr788bFWs8GHyccnmaz/DzyeGwYnnhTcpLPep8Qre58OxLffywdlpZp2LLvfvgaKAio8OUsE+0Qtz9MaY4SM0stgiupqKe6xRVMa9T8XJf/aVH4YkXDawRfFLQ0kCtv4lUdJb22LH9b4aGSmy6HxKOmQSi156g62HsOQxRdFmlM2ZyTnV9nURIf6ge34YW2vZfsas+7/QDlFfTjVWZ5RZRS//AJwgMw9C5JP3Y20GcUVNqXh2iq8xrJTY1Mqkaz3aR7begHsMWZUpyzLS0NPHq6iMa2+vPGtYMzaNgZ4cvVha1OBLMfdmsq+wB98Z50889miFvHHRepaBKaUZpxFWxz1a3Mes6Yae/RATa/8AmO+Bmf8A7QaGCF4Mnn+KrGGlHVSUX1F9ifbAHOqCjoU1VEklZWy7I9UxlYey9+wAxVo+DaqKlWrrwaGJv8OI71En05IO/XCnVLdtXYxWR27n0bcqr6XIYpq+ud6itcXZR5mF+56b98DqjiGsz6riWojFPSBrrEm7MffmcMGVcLrm+aU9CAIsuhBlnYN5r8vqT0J6X54N58MlyylGWZDBEuo2qJl8zNbkpY7n19sMjpm7NhR3xVe8U67MK6Vo6ShZKfXbxJTYlI+p3/W2NrSUtWJKKilV3iiLGSP7IUc9XQ/XGupy+nnYSTQK5A5sOnbG+tkp8syeSBdHjOl5ES3lH2U977nDr6FTyLpu8nCFl8xMbaIszqHjEbFhzu1vKoO/XmffEwMAVmQBeZ06Rzt398TGJtN9G1LB9D8BcdUHFFN8MwWlzaMWmpSdm7sncdxzH44YWpEcszorODzOOTftG4FzXLs3l4q4ZWQR+J40qU+0lO9t3W3NSbk25X7cmH9m37R6biDwssztkgzS+mOW9kqf7N6denbDYyxwzPKCayh2qMuvGpjAT1XAeppfDkJG5HLDVX1CU6eGAOWFapnYsT3Oxw+ttiLEkUKmwfxX1Fh8q9Ae49fXAuSMlhr3Z+g54I1TkyHe4ttioF0sWHzHmcPSEN/Jrjp/D35v1b+3bGZRV5gk9h1OM9R68sZJq8RmC+bkn9/f/nvgxhcE5z2Vvg6Whqmr5II2rmULrtdkH8oPTAfM6uapl1SsWtsB0AwbradwvmuPfC/nksmS5XU170gmkQqqLJ8qkm2o+gwQ21pyYScrGoI0LVzxUppkkCK7anKbFz6n+mKqKurUXVAu5LA2H4YrZPmiVlOrVckSVEi6rKwCrcsBc325cjvivJX0NMriWVpnJsw1MhB7AWtz3Fzis9ZGC/5IZDSSnJ+R9F/Ms1y+konmp5BNMTpiuLLq56rdh7c8I9RUSVErEubsRqbqT0P9cXs2NHXp8TSySxSBbeDJYqBq2VSPQ36jngZHcNZTuOWMNlkrHmRtrqjWsRLERclVIXWpNiALk+uJjZTUryTrHpOsnlbExVRbL5SHvhv9r2d5eVpc7gXMoR/5LCKUD3As31A9+uNnEHD2QcdeJmfBrJTZir3q6SS8Qba9wLW1XtuNupwr1nDFPTBhS8T5BWx3NtNV4T29mH9cLM8TUtQ2iRCUbaSKS4+jA/lifyVx8HWuF+M6zL5RlHELS1CRDSJJVtUQcgA683X/ADC/rfDqJYalFeJ42iYXRkNw3tj58rc4r62nhhrKj4gw7RSNYyJ6BudvTBPIuMKvJpgbGVL+dQ1g3uO/44vC3a8MVZVu6OzzwC225PLGn4OSNdT8sAcp4+yeoy+aoq5DBNET/AIJLW6g8vxwRqOKqSryM1dMXAmusOtLXANmYfXa/ocOnqYxXBSjRyumovj7/H3LtPJRzMV8VQybtsTpH0xjPneS5TFJUSVHiMgNlVdx9+OcZ/nc9FUjw2cOBd2LbXI6fTC5Uy1fxiNmUMugkSFXbQ0i7faN/vthNltqS6WTXXRpnJ7U5JHWIOKctzXKM3zKDXFJl1MZQkjKS1wdJFj/ADWxy5s/ziRFhfMJH2uVsAWH0G+PariNly6ry2CB1pqp0eVZXDkaN1AIA2vv64oiCWXRHNXU9PG0etgl7qtuwG/thbnJpZZDhBSbigpUQUyGZkKoRKW8Lle3ykkcrg/jjTFlS5tIyxszyBCwVFAVUGxYk7BQbffjXW/ArGroKoSMouJWAtbpa3tiR5tTR04p0pTqbaZ9Z/iD+X0Xlt1xUnIPqMrmpVEniQzx6vD1wsWA7ffvv6HGUlDUUsohqY2jJ3scN9Zn2XPlMEgywrVraFoj8hGnmb7lSen44q5UuW1M8RzKR4KXWDPThiWcd1639Sb4so5KuWATltHLW1cNNCxDFxyBuFvu30xMdehocpGXx5dwhTyTSyC/jyg2Rb7s5t3H9geWJhsfSuGLk89nHK7Js3ymRkrqGqp+xlQhSfRhsfvwLeNg51aSe/PHfZ8w4rZ2jOSZaQdr/HFlP+0flgFmf7P89z6B5Fynh6jlJuJoZJEcnsbCxxEoYRELMvDOPhAbGw256Vx7JEhj1qD5TvfHQaf9ndblc7PxVItNSR20LTSq7T+gP2R3JF98MVNHwlFGY/8A4/QutrFpY9bH/wBjvjNK2MXg6NGiuujuiuDluR5dTZjm0EVTL4VG7hp5B9hBctv0uBb3Iw2Z1mMJrG8NAlOD/BjQWVUHygDthrqsoySTLnhyGnhpWkN3hAuJt+VzvtvYXthZzTgvMAoedZ4Y1Xy3AsBflc3wQtjvUn7Gh6O6NEoR+qQn5hI1ZVMwJJ1X2N8ZiZyI4arXNBGbLq5x7+vTn5eXthmi4KR4l/8AsHpnJADSRCRCf9SkEfdjRV8EZ5ToTHTCq1k2aCTVcDc7Gxvy5A4bKSseTAq7NPw1hihPGnjuFWykm2jEqZZpJQz6XdVChvTHU+EeFKSu4OqvGpJRmiVTCZJEKSKNPkG42U7b264Xsr4KrcyzAUs1I8Chl8do4lBQ38wXe1hbZtuVsEYt9C5SxyweDFmWQQPPIiyoSji4AO+ze/LCwyGN2BABXY4bllpsraspcvRpI1ZyhckswBF129NJ25kYIcJrlWYVR8fKyKm+01RCukG/K4AF/UgE4tt5wVcuMgDLY67NYmaGnZ0p6dmml2Csii/zH7VvXe3e9wyTTRyiSCTQ6sHjY7FT0N8d2p9EelBoRSbHbygH0xUzDh+g4iCx1VODKtlSWMaWUe/b0xZwaXYqNqb5QwZDm8VbkdLV3IdowJABp0uPmBA9cTCnwpw5xJknEAy2eCVsj8RnNRIUtp0nSRY8ydIItiYmLWCJReR6paKqeVixAA6254tVGW5nWFFGd1VLCPmjp4o12/1EE/jglTIvr9+Nk0qptfb0xM5bmVhHajkX7QSlDXxZbAW8GnQWZzcsSSSSepJJJOE+tdgpIYgnsMOf7WKZ0r6evVD4Uy+GW6Bh0OOfVE94vM3Ln3xy0nveT1tNsVRFrrBdocxkScp4p1KLjfHS6Di7Ka7LoRWTE1CLpKMbfXHNM54fkyXJ6PM6iY/GTS2eLoikbL7jr/xgF8WGq1a/IbYZKtpiIauF0fV7M6zWZvQqT8LFHoPMabg4BVmbtQ5xT1eWsIlqlaKaIL5S3zK1u+2A+U1SyxlWY/RsXvhlq1kSVWMS+ZXXmGHIg98LhPZLJ0LdPDUVYXY15bxnLUKFlmkDHYqrDf6MDb6Wxr4sfMqOmmpanOagRy2JSmiSExjsSB5vw5e91Xh6WKTiGhgqFX4qKsiu67LMuoWJHfvgpxxWPNV1G9wAcdurZbzHo8JqfLp3sny8nvBCZQ81VNTmQ1szEySsN3HMhRyHcjqfuwxSxReGUlNww5kbY5JQ1s+W1XxEBsyiw1fKe18dR4cros/FLPOVWm2WZCbebsepufzxXCi8Mu3KSyjatXTJUhJgXBGxubnewOw5Y6Lk6UlPQj4YARgXZiLH1O/TC/xLUUVFFC9RSvVsWEdPTxr5Q+4FyBti9NWFXWNQFuLEA+Ufq2EzmpcIbCDjyzLN69UpteoeVNRcfKRzuPux7gfVVsKPItXeUSxhSjWKKOW3viYqsktZLC54qqdMVj0vjTS1NZmlWsEelOrHsvU42RZZRUt2r6gM1/kj5fjg7lslEEc0kQUqNwF3wyUox+lFI1zfYMzTIaSqyeWjzARzlix8478rHmCO/v3xwDO6JcsziopI/FQU8gaPxwNQsQfqL/eMd6zfNVd2CKQRtvhK4qyunz+nYTWWqUfw5juR6H0xmnCT9SN+lsjCW2XRy3Pc4r85lWSumDiMWRUXSq9zbv64FLTT28dYj4e9iOttiRg6vDuaz1Xwy0rI97GRh/DHrq6/TD82SZfHk8dK1OzR0qHQ67Pfckg9yefviIwnNcD7Z01NL2+wg8O06zGadzcRKGKg8xy/MjBiozRnhMUSBF6BTgjRcIPHIK/La9JIpEOqGZNGtWG63HX6c8AJ4WoqiaGujeKQA6L7g/XrhEtPJy9Rsh/k4QpxBZYNo6ySn4joqpf/AB1Ed/UahfDVxKLzT+a+xF+9tsKRtDUwOd7SKzfQg4bs1pZKXNZZGJmpnc2Q88aqdSqXj2OXqNBZqEpvO7vgUql1gPiFtLowsunc+v5ff6YMcN53PR5r8RS6WpoiJDG/IEm+/wBT92A1ZTmSdyoJLGwXG6ly2T4pSF2BUBe7YJ275ZIjpnVXyjuE9dT1skGbU086xyQaGg1+TVe+47jf78YQVzslnie67BCB5h6e+FPg7MoqU1NNWEaFGsEAvZgbG3pbf/1wyGoiabTJIBok8QJpIYrYizD6nENpC0mytPDUVV5n0KpNtzbTYb48xkipU5heWaMoS7RgvbVfTe/tpFhyxMV8si3jLlRmEMkz+FBI/Yk9cWxnEOUxQM8TeNIwS1wAWPr0t64qJBpe8YscZcS1NFHw3WL4omq4UR1WIBjG19i1+l/rY4myzCLQryy/nkUszodUQZ/spY7+/tgRDS+LUinDgSE2s9xf2/7wr1vFXx1FlsDRTePRuurVYxyL1uOvLDBTzV2ZpSy5c6wTU0K6y6HVovttuNrX+owmOpyaP9TCy2HUy2mp4A84cg9QMZ5jBTtllXFSQaQFDgk7mzC/9cVcyp8/p3jr6X4STyWkiBa0g9QfzxMk4glzH4mkq8oeCZfI5VLpZuRv0wyNvIqdHo4EWgfNKevpaHLarwojLdw0ayAG+9hYnvsP74av2k5bFWZC9S0ShoSpiYAXW5IPL6Yu5Nl8NDxHJPNF5CjABjbSTuTc9Nji/wAWmGaglpXCrFLGFicFbO7EaQLG55Dp198TbZ5FwFOKpxbOEVdLaO/U/XDhm0wn4doa5AC7wjVbow2b8QcLuZSCMFSgDLsV7Yt5BXpU5NPQTBikDmTWouEUkCx9SdRGMs1mOTrwmo2fkCSRtKxK2IvuR0xcgaWAzNAjtoiOhlW+n/N+eK8YsT5Pl2UafKMWWeWsppqbKZwtYWUHe106k9+a4clhHPvnmQV4T8SGvpp1YgtMF02BNjsRv6HD7VU8UMyIvg+M6ECOQ6BIdym978+g7e2AvCOTeHLAjXkWIKHdyfONufucOGZ5TFLWmsdnk06TBAPlRhfl9cEmZkLnDyZjJCYs0RYquJyIvE03jU7WsN/Xc736YmK+d8Rpl7VZk1TV8slvDUeWOw636b/oYmISZO5DsKMk2sN8KtVQPBxJmMdJaVqmFfEjY7qSB/Sxx0LyJYnCnUVNPU8bpCkZEiQ6fE/mIBP4XthV/wBI6iTzkCR8Ky008c9bQtPT28yxvzP66Ys5OJcvr5YqeFmaSw8PVuqX9cP9GyrHpbFF6SieuFUYFM4UqG5XF+WMuxRxyN8zllNHmTF6vLf4sDQy3I8OQWIINtvTrjTSRimzNGUaNZ0sR1HTByKqi2HK3U9MUOIJ6OipDUzyrFpIKk9T6DrjTKKa3RYiLbltx2UM6pop0aZJPhyAPEYNp0qDY2PTYnHOuLeIPiKt2oZmMi+RJXayqO4t16XJxW4i4lzHOK/93UxMcI82k3Hlvsznlbn7YXU8GSNUp5FKlizaBfVe/wDcnbFq1LJocIVxzLllLMFLguXdwH83mufxxd4Vptc9Zp8MJNCBqdvKlm2Jtzxg0YDPeN20FQ110jcX27jBbJTHTo7SxjQiMLqTcm4+gAt+OHSS2iIWPyA6aNJ6w09KCEZvDG1ix/5wy5Jwz4NU5IBqGT+IIgGaw5Lckb41ZTFT/HQNURxmFG8SS+x5XBHrcDB2DPYf3Ql5aIV7MBLEkoV1ci5uR1A98V5xgpJpvIxRyU2UwvUu0UVMiF3dt21eluu9tvbC9xHxzRUVCUyt1lqJVLXWxERPtsT6dOuEriXiiauhMRmhhy4ELHAqk+IBupN+vX67d8IddmwdiYDIWtpDvtpHWyjriyiLbN+eZxPNNKBIRLLvOwNyT2vv+tsTAE7nEwwofYonjJGo3+mMaehy6OvkqzEhnm0nUe47frphQXOZ7qXkXyG4a354sz5trkDDSSQD7HGSTNara4HeWOOTTocIQwJ9bdMa540C3ewH83rhTl4klS1kFyfKpOB2a8WtQiRQ/iVEcXiFRuIhbmfU/hiHOGOia6LJPCCvEPEdJkKWlUyzG/8ACQ7/AKtjkua8R13EOYtU1MzJCn+FGQbADrfAvM62rzetj03nqZy2kX+p36Cw/DDnkdPk8NEWyt2qqnfzzqygKttWlbc/OLX/AJh2xNeEuhl0VXLEXyKk1S8yBZFAjYb2JIc87n9HGVO0VI0cSo5eXUTe+lm7dbC1vyxbSnjVyscQRgpkkVGuqXbubW3/AOsZ1pmo6MVGjxJHqzHs4tYLqsx+yeR9vW2ND2roy5k+WZ0BzCtVoKmNRDE2tqhnWz7kX22AA2H1xjm+Z0tJGYVZUGlQG7jr0/Llpxrlzmf9zrHDLTU6TG88TD5t97+w2GACyxiokqK+cPFGdUSxsLAEWG/oOnrffC1kltJlynkqKkxx0MsiQg6TKzamY9gCbm9+eNc1V4T1AFjOwHjKBpbtYN1229NseUmZUtPDJ+7YzTLOgVlS7MBbuRv/AN4E1lOtVK9dJKacXt8puel/Q88MS+Rcn8FOoqmqKgQ0iytI50DUwax7L2xjW5U1NFr8TUw+ZLAW/HfFvL58voJWMLPJIy7M1th2+v8ATGmrm+KbzXFzfbnbFygMTShu8errY9sTFupN10RxhV9BiYAOrxVQqD10Dffqcb1qpGnIUBQF2dj1OOXTzVxq2qoqgwBDqULLcLsPztjbX8QtXQCKomkAFz5FK3Pc74W68mlXnQsz4hpqCCVYaxJqtIwW07nVvZV6XHXtsOuEpsxihp6hqqrlnlq5U8cAFWKDd1ufXa+F2ScMNEeoi3K52/XviuFlcWAa3YnEKpIl6qXSGleI6aGviny6kjojCD4a6jLqJBBvcW3BsRglS8c1NFQPBSZekauxZlhgstza/O5998aeBcqo6mlVq6nhlZ8yii1OAbLpZmH12xaoYUrqOqqa3JaKnoPhZXSrjh8Mhh8ulr874U7IJtY6J2znFNsGQ8WSfDMhES3BNkUBr+nqN7YM1WU52cqQ1NTTLSuweKKCpQ21AkEqNwed/XAjIqujzda2lqsqy5UhoZZlkjg0SakAI3vizw5mVHX1M0EmTZZaKjlm1CDdmRbje/34tKe3Pp6KRinhN99A+voJKCoWOteMn5iFYn8f19cV5nj0aUt6XF9/QWxajzPJXy9BLQxipNNMG0oAPFLAoRv0FxhgpaL4vNAlZwxBRZU9y9SY9DRrp+bXq539MTK1wTbj/BVU7umJklRqI1nUell0qevU4wllE6MnIFbWB6jDPDQn9y5bNlOQwZmZoCZ5niMjCQMRY2Itt0wv8Y0lPQZ9NBRoIotEb+GD/hsVBK/Q3xMLVKWP7wRKpxWQSoEb6bvqHMW2vj0SFLkKBjSZPLYc8YNc7nDhRtM7fzYmNGJgAtvLGTbS1l6cv641NMbjSosOVxfGLEaj7nHtlO5wAQzSfzHGGsnmScFYqKknUtEHYADa/JrE25emMloKZ4VkQE35kPcW78sAFePNp4sqbL4wohMwmvbfVa35Y9yhBW5hFDUTmKJrgsLA8iQB6k7fXFgZfTMVADm999WNtLEaUN8PUVELMvnMcpXUbemISx0S22XVyTK6WVYZM01Tq0i1Ch0jVFHW7X3tby2JJuOl8eUGS5LLmTwSZ8kFOtMHaYrfz6rFRa99vN+F+uBjUNMpIHMmy6pLf0+uNn7tp9e2sgEbar9sWyyDfTZXlhokqZMwBfwWaSNZUUq32bA7sSdtI363HLF+vynJ4aRVbMV8V42k8e4JkFrqNPbp6nlfAr4GIKDZidyLNz6jGIoIiHNiFBv83Pb9ffiABomlUWVjYC3sMYAh9m27YLrQ05uSHt/qxDRU+rqNQJVdQufrgAFMyruAB/XGAdmPpgo1HTWuwbYWN3629seSUtHCLyll7efmfuwACym+x2xMeyONR0cr7e2JgAxb5j7nHhbbExMAEDEHbGcc8kd/DYi/PExMAHstTLKLO5IvfHoq5woUSGw6Y8xMAHjzSSAB2J6/XB+POskRUVuHYyLeYmcksQOfLbfpiYmADRW5rl01O0dLk8UEhjZdeu+5KnVy2Is1t/tYGQytFIrrYlbEagCPqOuPMTAATPE2YhlINNdeR+FjHcfy+uBfxExv5yLknbbniYmADFJWibUhsRjGaZ5m1SG5xMTABrxMTEwAf//Z"
 *     responses:
 *       201:
 *         description: The created book object
 *       400:
 *         description: Bad request
 */
bookRouter.post("/", authMiddleware, bookController.post.bind(bookController));
bookRouter.get('/getTopAndRandomBooks',authMiddleware,bookController.getTopAndRandomBooks.bind(bookController))


/**
 * @swagger
 * /book/:
 *   get:
 *     summary: Retrieve a list of all books
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Server error
 */
bookRouter.get("/", authMiddleware,bookController.get.bind(bookController));

/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Retrieve a single book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: A book object
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
bookRouter.get("/:id", authMiddleware,bookController.get.bind(bookController));

/**
 * @swagger
 * /book/isLiked/{id}:
 *   get:
 *     summary: Check if the book is liked by the current user
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Returns true if liked, false otherwise
 *       400:
 *         description: Bad request
 */
bookRouter.get("/isLiked/:id", authMiddleware, bookController.isLiked.bind(bookController));

/**
 * @swagger
 * /book/like/{id}:
 *   put:
 *     summary: Increment the like count of a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The updated book object
 *       400:
 *         description: Bad request
 */
bookRouter.put("/like/:id", authMiddleware, bookController.likeIncrement.bind(bookController));

/**
 * @swagger
 * /book/unlike/{id}:
 *   put:
 *     summary: Decrement the like count of a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The updated book object
 *       400:
 *         description: Bad request
 */
bookRouter.put("/unlike/:id", authMiddleware, bookController.likeDecrement.bind(bookController));

/**
 * @swagger
 * /book/getUserBooksAndFavorites/{name}:
 *   get:
 *     summary: Retrieve a user's books and their favorites
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's name
 *     responses:
 *       200:
 *         description: A list of the user's  and favorites
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
bookRouter.get("/getUserBooksAndFavorites/:name", authMiddleware,bookController.getUserBooksAndFavorites.bind(bookController));

/**
 * @swagger
 * /book/search/{query}:
 *   get:
 *     summary: Search for books by title
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: A list of books matching the search query
 *       500:
 *         description: Server error
 */
bookRouter.get("/search/:query", authMiddleware, bookController.search.bind(bookController));

/**
 * @swagger
 * /book/searchByHero/{hero}:
 *   get:
 *     summary: Search for books by hero name
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hero
 *         schema:
 *           type: string
 *         required: true
 *         description: The hero's name
 *     responses:
 *       200:
 *         description: A list of books matching the hero name
 *       500:
 *         description: Server error
 */
bookRouter.get("/searchByHero/:hero", authMiddleware, bookController.searchByHero.bind(bookController));

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The deleted book object
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
bookRouter.delete("/:id", authMiddleware, bookController.delete.bind(bookController));
bookRouter.post('/generateBook',authMiddleware,bookController.generateStory.bind(bookController))
bookRouter.post('/toDocx',authMiddleware,bookController.toDocx.bind(bookController))
bookRouter.post('/generateImage/:id',authMiddleware,bookController.generateImage.bind(bookController))

export default bookRouter;
