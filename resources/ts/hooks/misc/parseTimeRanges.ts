// https://developer.mozilla.org/ja/docs/Web/API/TimeRanges
// TimeRanges インターフェイスは、主に <audio> 要素と <video> 要素で使用するために
// メディアをロードするときにメディアのどの部分がバッファリングされたかを追跡する目的で、
// 一連の時間範囲を表すために使用します。


export default function parseTimeRanges(ranges: TimeRanges) {
    const result: { start: number; end: number }[] = [];
  
    for (let i = 0; i < ranges.length; i++) {
      result.push({
        start: ranges.start(i),
        end: ranges.end(i),
      });
    }
  
    return result;
}